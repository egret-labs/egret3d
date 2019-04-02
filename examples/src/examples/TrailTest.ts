namespace examples {

    export class TrailTest implements Example {

        async start() {
            // 加载默认资源
            await RES.loadConfig("default.res.json", "resource/");
            
            // 创建主相机
            egret3d.Camera.main;
            
            // 创建背景
            createGridRoom();
            
            // 创建拖尾游戏对象
            const trailObject = egret3d.creater.createGameObject("Trail-Object");
            const trailComponent = trailObject.addComponent(egret3d.trail.TrailComponent);
            
            // 设置渲染选项
            const meshRenderer = trailObject.getComponent(egret3d.MeshRenderer);
            if (meshRenderer) {
                // 设置素材
                const texture = await RES.getResAsync("threejs/textures/sprite0.jpg");
                meshRenderer.material = egret3d.Material.create().setTexture(texture);
                // 设置双面渲染
                meshRenderer.material.setCullFace(false);
            } else {
                console.error('no MeshRenderer on Trail object');
                return;
            }

            // 启动拖尾 trailComponent.play();
            // 暂停拖尾 trailComponent.pause();
            // 停止拖尾 trailComponent.stop();
        }
    }
}
