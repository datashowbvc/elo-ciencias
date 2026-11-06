import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export function mountHospitalViewer(root: HTMLElement): void {
 const get=<T extends HTMLElement>(id:string)=>{const el=root.querySelector<T>('#'+id);if(!el)throw new Error('Elemento ausente: '+id);return el;};
 const host=get<HTMLDivElement>('hospital-canvas'),status=get<HTMLParagraphElement>('model-status'),progress=get<HTMLProgressElement>('model-progress'),list=get<HTMLSelectElement>('mesh-list'),info=get<HTMLParagraphElement>('mesh-info'),reset=get<HTMLButtonElement>('model-reset'),clear=get<HTMLButtonElement>('model-clear'),retry=get<HTMLButtonElement>('model-retry');
 const url=root.dataset.modelUrl;
 if(!url){status.textContent='Caminho do modelo ausente.';return;}
 let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch(error){status.textContent='Não foi possível iniciar WebGL neste dispositivo. Use o link do GLB original ou outro navegador.';progress.hidden=true;console.error(error);return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 host.append(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','Visualização tridimensional do hospital');
 const scene=new THREE.Scene();scene.background=new THREE.Color('#f4f7fa');
 const camera=new THREE.PerspectiveCamera(45,1,.01,10000);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.enablePan=true;controls.enableZoom=true;
 scene.add(new THREE.HemisphereLight(0xffffff,0x718094,2));
 const sun=new THREE.DirectionalLight(0xffffff,3);sun.position.set(4,8,6);scene.add(sun);
 const fill=new THREE.DirectionalLight(0xdcecff,1);fill.position.set(-4,3,-5);scene.add(fill);
 let model:THREE.Group|undefined,box:THREE.BoxHelper|undefined,dead=false,failed=false;
 let radius=1;const center=new THREE.Vector3();
 const meshes:THREE.Mesh[]=[];
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 function fail(message:string,error?:unknown){failed=true;status.textContent=message;progress.hidden=true;retry.hidden=false;list.disabled=true;reset.disabled=true;clear.disabled=true;if(error)console.error(error);}
 function resetView(){if(!model)return;const halfFov=THREE.MathUtils.degToRad(camera.fov/2);const hFov=Math.atan(Math.tan(halfFov)*camera.aspect);const distance=radius/Math.sin(Math.min(halfFov,hFov))*1.15;camera.near=Math.max(radius/1000,.00001);camera.far=distance+radius*100;camera.updateProjectionMatrix();camera.position.copy(center).add(new THREE.Vector3(1,.7,1).normalize().multiplyScalar(distance));controls.target.copy(center);controls.minDistance=radius*.05;controls.maxDistance=radius*30;controls.update();}
 function resize(){const width=Math.max(1,host.clientWidth),height=Math.max(1,host.clientHeight);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);}
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 function removeBox(){if(box){scene.remove(box);box.geometry.dispose();box.material.dispose();box=undefined;}}
 function select(index:number){removeBox();const mesh=meshes[index];if(!mesh){list.value='';info.textContent='Nenhuma malha selecionada.';return;}box=new THREE.BoxHelper(mesh,0x00b8d4);box.material.depthTest=false;box.renderOrder=999;scene.add(box);list.value=String(index);info.textContent=`mesh-${index} · nome original: ${mesh.name||'(sem nome)'}. Identificação técnica; setor não confirmado.`;}
 function onSelect(){select(Number(list.value));}
 function onClear(){select(-1);}
 const active=new Set<number>();let down:{x:number;y:number;id:number}|undefined;let gesture=false;
 function onDown(e:PointerEvent){active.add(e.pointerId);if(active.size>1)gesture=true;down={x:e.clientX,y:e.clientY,id:e.pointerId};}
 function onUp(e:PointerEvent){const click=down&&down.id===e.pointerId&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6&&!gesture&&e.button===0;active.delete(e.pointerId);if(!active.size){down=undefined;gesture=false;}if(!click||failed||!model)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(meshes,false)[0];select(hit?meshes.indexOf(hit.object as THREE.Mesh):-1);}
 function onCancel(e:PointerEvent){active.delete(e.pointerId);down=undefined;if(!active.size)gesture=false;}
 function onLost(e:Event){e.preventDefault();renderer.setAnimationLoop(null);fail('O contexto gráfico foi interrompido. Tente novamente.');}
 function onRetry(){window.location.reload();}
 host.addEventListener('pointerdown',onDown);host.addEventListener('pointerup',onUp);host.addEventListener('pointercancel',onCancel);renderer.domElement.addEventListener('webglcontextlost',onLost);
 list.addEventListener('change',onSelect);reset.addEventListener('click',resetView);clear.addEventListener('click',onClear);retry.addEventListener('click',onRetry);
 function disposeModel(group:THREE.Object3D){const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();group.traverse(obj=>{const item=obj as THREE.Mesh;if(item.geometry)geometries.add(item.geometry);if(item.material)for(const m of Array.isArray(item.material)?item.material:[item.material]){materials.add(m);for(const value of Object.values(m))if(value instanceof THREE.Texture)textures.add(value);}});for(const t of textures){const image=t.image;if(typeof ImageBitmap!=='undefined'&&image instanceof ImageBitmap)image.close();t.dispose();}for(const g of geometries)g.dispose();for(const m of materials)m.dispose();}
 status.textContent='Baixando modelo…';progress.removeAttribute('value');
 new GLTFLoader().load(url,gltf=>{
  if(dead){disposeModel(gltf.scene);return;}
  try{model=gltf.scene;model.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(model);if(bounds.isEmpty())throw new Error('Modelo sem limites visíveis');bounds.getCenter(center);radius=bounds.getSize(new THREE.Vector3()).length()/2;if(!Number.isFinite(radius)||radius<=0)throw new Error('Dimensões inválidas');scene.add(model);model.traverse(obj=>{if((obj as THREE.Mesh).isMesh)meshes.push(obj as THREE.Mesh);});list.replaceChildren();meshes.forEach((mesh,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent=`mesh-${index} · ${mesh.name||'sem nome'}`;list.append(option);});list.selectedIndex=-1;list.disabled=meshes.length===0;reset.disabled=false;clear.disabled=meshes.length===0;resetView();progress.hidden=true;status.textContent=`Modelo carregado. ${meshes.length} objetos Mesh; linhas não entram na seleção.`;}catch(error){fail('Não foi possível preparar o modelo. Consulte o arquivo original.',error);}
 },event=>{if(dead||failed)return;if(event.lengthComputable&&event.total>0){progress.max=100;progress.value=Math.round(event.loaded/event.total*100);status.textContent=progress.value>=100?'Preparando geometria e texturas…':`Carregando: ${progress.value}%`;}else{progress.removeAttribute('value');status.textContent=`Baixando modelo: ${(event.loaded/1048576).toFixed(1)} MiB`; }},error=>{if(!dead)fail('Falha ao carregar o GLB. Verifique a conexão e o caminho do arquivo.',error);});
 renderer.setAnimationLoop(()=>{if(dead||failed||document.hidden)return;controls.update();renderer.render(scene,camera);});
 function destroy(){if(dead)return;dead=true;renderer.setAnimationLoop(null);observer.disconnect();host.removeEventListener('pointerdown',onDown);host.removeEventListener('pointerup',onUp);host.removeEventListener('pointercancel',onCancel);renderer.domElement.removeEventListener('webglcontextlost',onLost);list.removeEventListener('change',onSelect);reset.removeEventListener('click',resetView);clear.removeEventListener('click',onClear);retry.removeEventListener('click',onRetry);controls.dispose();removeBox();if(model)disposeModel(model);renderer.dispose();renderer.domElement.remove();}
 window.addEventListener('pagehide',event=>{if(!event.persisted)destroy();},{once:true});
}
