import { defineStore } from 'pinia'
import { userStore } from './userStore';

export const goodsStore = defineStore('goods', {
    state: () => {
        return {
            goodsList: [{
                id: 1,
                name: '商品1',
                price: 100,
            }, {
                id: 2,
                name: '商品2',
                price: 200,
            }, {
                id: 3,
                name: '商品3',
                price: 300,
            }, {
                id: 4,
                name: '商品4',
                price: 400,
            }],
            selectedGoods: [],
        }
    },

    actions: {
        selectGoods(goods) {
            // const uStore = userStore();
            // if(!uStore.userInfo.name){
            //     return false;
            // }
            // console.log(`${uStore.userInfo.name}添加了${goods.name}`);
            const good = this.selectedGoods.find(itme => {
                if (itme.id == goods.id) return itme;
            })
            if (!!good) {
                good.num++;
            } else {
                this.selectedGoods.push(Object.assign(goods, { num: 1 }));
            }
        },
        delGoods(goods) {
            const good = this.selectedGoods.find(itme => {
                if (itme.id == goods.id) {
                    !!itme.num && itme.num--;
                    return itme;
                };
            });
            if (!!good && good.num <= 0) {
                const idx = this.selectedGoods.indexOf(good);
                this.selectedGoods.splice(idx, 1);
            }
        }
    },

    getters: {
        allPrice() {
            return this.selectedGoods.reduce((total, goods) => {
                return total + goods.price * goods.num;
            }, 0);
        },
    },
})
