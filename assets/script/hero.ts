const {ccclass, property} = cc._decorator;
const speed = 128;

@ccclass
export default class Hero extends cc.Component {
    /**
     * 是否移动
     */
    isMove: boolean = false;
    /**
     * 移动方向
     */
    direction: {x: number, y: number} = null;
    /**
     * 目标位置
     */
    destination: {x: number, y: number} = null;

    // onLoad () {}

    start () {
        cc.Canvas.instance.node.on(
            cc.Node.EventType.TOUCH_END, (oEvent: cc.Event) => {

                // 获取点击的坐标
                let destinationX = oEvent["getLocationX"]();
                let destinationY = oEvent["getLocationY"]();

                // 转换坐标点
                let destinationV2 = this.node.convertToNodeSpaceAR(cc.v2(destinationX, destinationY));
                this.direction = {x: 0, y: 0};

                // 找到英雄
                let hero = cc.find("Canvas/hero");
                // 判断移动位置
                this.direction.x = hero.x <= destinationV2.x ? +1: -1;
                this.direction.y = hero.y <= destinationV2.y ? +1: -1;

                // 设置目标位置
                this.destination = {x: destinationV2.x, y: destinationV2.y};

                //
                if (!this.isMove) {
                    this.isMove = true;
                    let skeleton = hero.getComponent(sp.Skeleton);
                    skeleton.setAnimation(1, "run", true);
                }
            }
        )
    }

    update (dt) {
        if (!this.isMove) {
            return;
        }

        let hero = cc.find("Canvas/hero");

        if ((hero.x <= this.destination.x && this.destination.x < 0) ||
            (hero.x >= this.destination.x && this.destination.x > 0)) {
            this.direction.x = 0;
        }

        if ((hero.y <= this.destination.y && this.destination.y < 0) ||
            (hero.y >= this.destination.y && this.destination.y > 0)) {
            this.direction.y = 0;
        }

        if (0 == this.direction.x && 0 == this.direction.y) {
            this.isMove = false;
            hero.getComponent(sp.Skeleton).clearTrack(1);
            return;
        }

        hero.x = this.direction.x * speed * dt;
        hero.y = this.direction.y * speed * dt;
    }
}
