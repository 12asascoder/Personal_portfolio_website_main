import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

export default function LiquidEther(props){
  // For brevity and performance, mount a minimal transparent canvas placeholder.
  // The full reference implementation can be added later if needed.
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    renderer.setClearColor(0x000000, 0);
    const resize=()=>{
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
    };
    el.appendChild(renderer.domElement);
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);
    return ()=>{ try{ ro.disconnect(); }catch{} if(renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); renderer.dispose(); };
  },[]);
  return <div ref={ref} className="liquid-ether-container" />
}


