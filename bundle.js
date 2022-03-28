(()=>{"use strict";class s{constructor(s,t,e){this.sprite=new Image,this.pos=s,this.size=t,this.sprite.src=e}draw(s,t){s.drawImage(this.sprite,this.pos.x-this.size.x/2-t.x,this.pos.y-this.size.y/2-t.y)}get getPosition(){return this.pos}get bounds(){return{left:this.pos.x-this.size.x/2,right:this.pos.x+this.size.x/2,top:this.pos.y-this.size.y/2,bottom:this.pos.y+this.size.y/2}}checkCollision(s){return this.bounds.left<s.bounds.right&&this.bounds.right>s.bounds.left&&this.bounds.top<s.bounds.bottom&&this.bounds.bottom>s.bounds.top}}class t extends s{constructor(){super({x:0,y:0},{x:16,y:32},"assets/neo/0.png"),this.vel={x:0,y:0},this.grounded=!1,this.flip=!1,this.last=Date.now(),this.counter=0,this.dead=!1}reset(){this.dead=!0,setTimeout((()=>{this.dead=!1,this.pos={x:0,y:0}}),1500)}move(s,t){s&&(this.vel.x-=.5),t&&(this.vel.x+=.5)}jump(){this.grounded&&(this.vel.y=10)}tick(s,e){this.pos.x+=this.vel.x;for(const t of s)this.checkCollision(t)&&(this.pos.x-=this.vel.x>0?this.bounds.right-t.bounds.left:this.bounds.left-t.bounds.right,this.vel.x=0);this.pos.y-=this.vel.y,this.grounded=!1;for(const t of s)this.checkCollision(t)&&(this.pos.y-=this.vel.y>0?this.bounds.top-t.bounds.bottom:this.bounds.bottom-t.bounds.top,this.vel.y=0,this.grounded=this.pos.y<t.getPosition.y);return this.vel.x*=.9,this.vel.y-=.5,this.vel.y+.5>0?this.sprite.src="assets/neo/4.png":this.vel.y+.5<0?this.sprite.src="assets/neo/5.png":(this.counter>=(e?4:2)&&(this.counter=0),this.sprite.src=e?`assets/neo/${t.FRAMES.moving[this.counter]}.png`:`assets/neo/${t.FRAMES.idle[this.counter]}.png`,void(Date.now()>this.last+(e?100:200)&&(this.counter++,this.last=Date.now())))}draw(s,t){this.dead&&Date.now()%400<200||(this.flip&&s.scale(-1,1),s.drawImage(this.sprite,(this.pos.x+this.size.x*(this.flip?1:-1)-t.x)*(this.flip?-1:1),this.pos.y-this.size.y/2-t.y),this.flip&&s.scale(-1,1))}setFlip(s){this.flip=s}}t.FRAMES={idle:[0,1],moving:[2,1,3,1]};class e extends s{constructor(s,t){super(s,{x:32,y:32},`assets/tiles/${t}.png`)}}const i=JSON.parse("[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,1],[1,1,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1],[1,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1],[1,0,0,1,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]"),h=new class{constructor(){this.run=!1,this.canvas=document.querySelector("canvas"),this.ctx=this.canvas.getContext("2d"),this.keys={left:!1,right:!1,jump:!1},this.cam={x:-window.innerWidth/2,y:-window.innerHeight/2},this.player=new t,this.tiles=[],this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight,window.addEventListener("resize",(()=>{this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight})),document.addEventListener("keydown",(s=>this.handleKey(s,!0))),document.addEventListener("keyup",(s=>this.handleKey(s,!1)))}play(s){this.run=s,s&&requestAnimationFrame((()=>this.tick()))}tick(){this.run&&requestAnimationFrame((()=>this.tick())),this.ctx.fillStyle="#61afef",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);for(const s of this.tiles)s.draw(this.ctx,this.cam);this.player.draw(this.ctx,this.cam),this.player.dead||(this.player.move(this.keys.left,this.keys.right),this.keys.jump&&this.player.jump(),this.player.tick(this.tiles,this.keys.left||this.keys.right),this.cam.x=Math.round(this.cam.x-.05*(this.cam.x+this.canvas.width/2-this.player.getPosition.x)),this.cam.y=Math.round(this.cam.y-.1*(this.cam.y+this.canvas.height/2-this.player.getPosition.y)),this.cam.y>-400&&(this.cam.y=-400))}loadMap(s){for(let t=0;t<s.length;t++)for(let i=0;i<s[t].length;i++){if(0===s[t][i])continue;let h="";this.exists(s,t-1,i)&&(h+="u"),this.exists(s,t+1,i)&&(h+="d"),this.exists(s,t,i-1)&&(h+="l"),this.exists(s,t,i+1)&&(h+="r");let a=0;switch(h){case"":a=16;break;case"u":a=15;break;case"d":a=13;break;case"l":a=12;break;case"r":a=10;break;case"ud":a=14;break;case"lr":a=11;break;case"ul":a=9;break;case"ur":a=7;break;case"dl":a=3;break;case"dr":a=1;break;case"udl":a=6;break;case"udr":a=4;break;case"ulr":a=8;break;case"dlr":a=2;break;case"udlr":a=5}this.tiles.push(new e({x:32*(i-(s[t].length-1)/2),y:32*(t-(s.length-1)/2)},a-1))}}handleKey(s,t){switch(s.key){default:return;case"ArrowLeft":case"a":t&&this.player.setFlip(!0),this.keys.left=t;break;case"ArrowRight":case"d":t&&this.player.setFlip(!1),this.keys.right=t;break;case"ArrowUp":case"w":case" ":this.keys.jump=t;break;case"p":t&&this.play(!this.run);break;case"o":t&&this.player.reset()}s.preventDefault()}exists(s,t,e){return t>=0&&e>=0&&t<s.length&&e<s[t].length&&1===s[t][e]}};h.loadMap(i),h.play(!0)})();