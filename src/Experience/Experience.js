import * as THREE from 'three';
import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import Camera from './Utils/Camera.js';
import Renderer from './Utils/Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import Sources from './Utils/Sources.js';
import Debug from './Utils/Debug.js';

let instance = null;

export default class Experience
{
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;
    window.experience = instance;

    // Option
    this.canvas = canvas;

    //Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(Sources);
    this.camera = new Camera();
    this.world = new World();
    this.renderer = new Renderer();

    //Time tick event 
    this.time.on('tick', () => {
      this.update();
    });

    // Resize event
    this.sizes.on('resize', () =>
    {
      this.resize();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy()
  {
    this.sizes.off('resize');
    this.time.off('tick');

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // test if it's a mesh 
      if (child instanceof THREE.Mesh)
      {
        child.geometry.dispose();
        // Loop through the material properties 
        for (const key in child.material)
        {
          const value = child.material[key];
          // Test if there is a dispose function 
          if (value && value.dispose === 'function')
          {
            value.dispose();
          }
        }
      }
    });
    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) 
      this.debug.ui.destroy();
  }
}
