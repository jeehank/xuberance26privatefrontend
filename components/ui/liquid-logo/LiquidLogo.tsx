"use client";

import React, { useEffect, useRef, useState } from "react";
import { parseLogoImage } from "./parseLogoImage";
import { vertexShaderSource, liquidFragSource } from "./shader";

interface LiquidLogoProps {
  className?: string;
  imageUrl: string;
  patternScale?: number;
  refraction?: number;
  edge?: number;
  patternBlur?: number;
  liquid?: number;
  speed?: number;
  showProcessing?: boolean;
}

export default function LiquidLogo({
  className = "",
  imageUrl,
  patternScale = 2,
  refraction = 0.015,
  edge = 0.4,
  patternBlur = 0.005,
  liquid = 0.07,
  speed = 0.3,
  showProcessing = true,
}: LiquidLogoProps) {
  const [processing, setProcessing] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation>>({});
  const totalAnimationTimeRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const renderIdRef = useRef<number | null>(null);
  const cleanUpTextureRef = useRef<(() => void) | undefined>(undefined);
  const imageDataRef = useRef<ImageData | null>(null);

  const updateUniforms = () => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !uniforms) return;
    gl.uniform1f(uniforms.u_edge, edge);
    gl.uniform1f(uniforms.u_patternBlur, patternBlur);
    gl.uniform1f(uniforms.u_time, totalAnimationTimeRef.current);
    gl.uniform1f(uniforms.u_patternScale, patternScale);
    gl.uniform1f(uniforms.u_refraction, refraction);
    gl.uniform1f(uniforms.u_liquid, liquid);
  };

  const resizeCanvas = () => {
    const canvasEl = canvasRef.current;
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!canvasEl || !gl || !uniforms) return;

    const imgData = imageDataRef.current;
    const imgRatio = imgData ? imgData.width / imgData.height : 1;
    gl.uniform1f(uniforms.u_img_ratio, imgRatio);

    const side = 1000;
    const dpr = window.devicePixelRatio || 1;
    canvasEl.width = side * dpr;
    canvasEl.height = side * dpr;
    gl.viewport(0, 0, canvasEl.height, canvasEl.height);
    gl.uniform1f(uniforms.u_ratio, 1);
    gl.uniform1f(uniforms.u_img_ratio, imgRatio);
  };

  const cleanTexture = () => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    const imgData = imageDataRef.current;
    if (!gl || !uniforms || !imgData) return;

    const existingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
    if (existingTexture) {
      gl.deleteTexture(existingTexture);
    }

    const imageTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    try {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        imgData.width,
        imgData.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imgData.data
      );

      gl.uniform1i(uniforms.u_image_texture, 0);
    } catch (e) {
      console.error("Error texturing:", e);
    }

    return () => {
      if (imageTexture) {
        gl.deleteTexture(imageTexture);
      }
    };
  };

  useEffect(() => {
    let active = true;
    setProcessing(true);

    const init = async () => {
      try {
        const { imageData: imgData } = await parseLogoImage(imageUrl);
        if (!active) return;
        imageDataRef.current = imgData;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext("webgl2", {
          antialias: true,
          alpha: true,
        }) as WebGL2RenderingContext | null;

        if (!gl) {
          console.warn("Failed to initialize WebGL2");
          return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const createShader = (glContext: WebGL2RenderingContext, sourceCode: string, type: number) => {
          const shader = glContext.createShader(type);
          if (!shader) return null;
          glContext.shaderSource(shader, sourceCode);
          glContext.compileShader(shader);
          if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
            glContext.deleteShader(shader);
            return null;
          }
          return shader;
        };

        const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = createShader(gl, liquidFragSource, gl.FRAGMENT_SHADER);
        const program = gl.createProgram();

        if (!program || !vertexShader || !fragmentShader) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          return;
        }

        const getUniforms = (prog: WebGLProgram, glCtx: WebGL2RenderingContext) => {
          const uniformsList: Record<string, WebGLUniformLocation> = {};
          const uniformCount = glCtx.getProgramParameter(prog, glCtx.ACTIVE_UNIFORMS);
          for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = glCtx.getActiveUniform(prog, i);
            if (!uniformInfo) continue;
            const loc = glCtx.getUniformLocation(prog, uniformInfo.name);
            if (loc !== null) {
              uniformsList[uniformInfo.name] = loc;
            }
          }
          return uniformsList;
        };

        uniformsRef.current = getUniforms(program, gl);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.useProgram(program);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        glRef.current = gl;

        gl.uniform1f(uniformsRef.current.u_edge, edge);
        gl.uniform1f(uniformsRef.current.u_patternBlur, patternBlur);
        gl.uniform1f(uniformsRef.current.u_time, 0);
        gl.uniform1f(uniformsRef.current.u_patternScale, patternScale);
        gl.uniform1f(uniformsRef.current.u_refraction, refraction);
        gl.uniform1f(uniformsRef.current.u_liquid, liquid);

        if (cleanUpTextureRef.current) {
          cleanUpTextureRef.current();
        }
        cleanUpTextureRef.current = cleanTexture();

        setProcessing(false);

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        lastRenderTimeRef.current = performance.now();

        const renderLoop = (currentTime: number) => {
          if (!glRef.current || !uniformsRef.current) return;
          const deltaTime = currentTime - lastRenderTimeRef.current;
          lastRenderTimeRef.current = currentTime;

          totalAnimationTimeRef.current += deltaTime * speed;
          glRef.current.uniform1f(uniformsRef.current.u_time, totalAnimationTimeRef.current);
          glRef.current.drawArrays(glRef.current.TRIANGLE_STRIP, 0, 4);

          renderIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderIdRef.current = requestAnimationFrame(renderLoop);
      } catch (err) {
        console.error("Failed to process logo image:", err);
      }
    };

    init();

    return () => {
      active = false;
      window.removeEventListener("resize", resizeCanvas);
      if (renderIdRef.current) {
        cancelAnimationFrame(renderIdRef.current);
      }
      if (cleanUpTextureRef.current) {
        cleanUpTextureRef.current();
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    updateUniforms();
  }, [edge, patternBlur, patternScale, refraction, liquid, speed]);

  return (
    <>
      {processing && showProcessing && (
        <div className="text-cyan-400/50 flex size-full items-center justify-center text-2xl font-bold font-orbitron animate-pulse">
          <span>Processing Logo</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`block size-full object-contain ${className} ${processing ? "hidden" : ""}`}
      />
    </>
  );
}
