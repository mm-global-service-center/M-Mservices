import {useEffect,useRef} from 'react';
import * as THREE from 'three';

export default function Globe(){
 const ref=useRef(null);
 useEffect(()=>{
  const holder=ref.current;if(!holder)return;
  let renderer,frame,alive=true,resize;
  try{
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
   renderer.setSize(holder.clientWidth,holder.clientHeight);renderer.setClearColor(0,0);holder.appendChild(renderer.domElement);
   const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(33,holder.clientWidth/holder.clientHeight,.1,100);camera.position.z=5.9;
   scene.add(new THREE.AmbientLight(0xffffff,1.5));const light=new THREE.DirectionalLight(0xffffff,1.5);light.position.set(-3,4,5);scene.add(light);
   const earthTexture=new THREE.TextureLoader().load(import.meta.env.BASE_URL+'earth.jpg',()=>{if(alive&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)renderer.render(scene,camera)});earthTexture.colorSpace=THREE.SRGBColorSpace;
   const sphere=new THREE.Mesh(new THREE.SphereGeometry(1.54,72,56),new THREE.MeshPhongMaterial({map:earthTexture,shininess:8,specular:new THREE.Color('#335b71')}));scene.add(sphere);sphere.rotation.z=.08;
   // Both languages are drawn as full phrases on a transparent curved cylinder.
   // The rear half passes behind the opaque globe, rather than fading in/out.
   const canvas=document.createElement('canvas');canvas.width=4096;canvas.height=512;const ctx=canvas.getContext('2d');
   ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';ctx.strokeStyle='rgba(9,49,75,.85)';ctx.lineWidth=16;ctx.lineJoin='round';
   const draw=(text,x,y,font,dir)=>{ctx.direction=dir;ctx.font=font;ctx.strokeText(text,x,y,1550);ctx.fillText(text,x,y,1550)};
   draw('مركز شركة مطر ومصري',1024,160,'700 175px Tahoma, Arial, sans-serif','rtl');
   draw('مركز الخدمة الشاملة',1024,345,'900 190px Tahoma, Arial, sans-serif','rtl');
   draw('MATAR & MASRI COMPANY',3072,160,'700 140px Arial, sans-serif','ltr');
   draw('COMPREHENSIVE SERVICE CENTER',3072,345,'800 145px Arial, sans-serif','ltr');
   const textTexture=new THREE.CanvasTexture(canvas);textTexture.colorSpace=THREE.SRGBColorSpace;textTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   const band=new THREE.Mesh(new THREE.CylinderGeometry(1.58,1.58,.55,128,1,true),new THREE.MeshBasicMaterial({map:textTexture,transparent:true,depthWrite:false,side:THREE.FrontSide}));band.position.y=-.87;scene.add(band);
   const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,started=performance.now();
   function render(now=performance.now()){if(!alive)return;const rotation=reduce?.8:.8+(now-started)/26000*Math.PI*2;sphere.rotation.y=rotation;band.rotation.y=rotation+Math.PI;renderer.render(scene,camera);if(!reduce)frame=requestAnimationFrame(render)}
   render();resize=()=>{if(!holder.clientWidth||!holder.clientHeight)return;camera.aspect=holder.clientWidth/holder.clientHeight;camera.updateProjectionMatrix();renderer.setSize(holder.clientWidth,holder.clientHeight);if(reduce)renderer.render(scene,camera)};window.addEventListener('resize',resize);
   return()=>{alive=false;cancelAnimationFrame(frame);window.removeEventListener('resize',resize);sphere.geometry.dispose();sphere.material.dispose();band.geometry.dispose();band.material.dispose();earthTexture.dispose();textTexture.dispose();renderer.dispose();if(renderer.domElement.parentNode===holder)holder.removeChild(renderer.domElement)};
  }catch(e){holder.classList.add('globe-fallback');return()=>{alive=false;if(renderer)renderer.dispose()}}
 },[]);
 return <div className="globe-stage" aria-label="كرة أرضية ثلاثية الأبعاد بألوان طبيعية، تدور حولها عبارة مركز شركة مطر ومصري ومركز الخدمة الشاملة بالعربية والإنجليزية"><div className="globe-orbit orbit-one"/><div className="globe-orbit orbit-two"/><div className="globe-canvas" ref={ref}/><div className="globe-logo"><img src={import.meta.env.BASE_URL+'images/brand-logo.png'} alt="شعار M&M الذهبي"/></div><div className="fallback-caption">مركز شركة مطر ومصري<br/>مركز الخدمة الشاملة</div><span className="globe-spark spark-1">✳</span><span className="globe-spark spark-2">✦</span></div>
}
