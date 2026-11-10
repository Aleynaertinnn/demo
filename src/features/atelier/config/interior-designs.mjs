import { MathUtils } from 'three'

export const interiorDesigns = [
  { id:'sade', name:'Sade', description:'Pencere önünde kanepe, ayrı çalışma köşesi ve hafif meşe mobilyalar.', colors:{lamp:'#fff5dc',floor:'#ece3ce',wall:'#fbf8ee',wood:'#d7c6a6',fabric:'#e6e0d0',cushion:'#f5f1e6',rug:'#e3e8df',metal:'#88979d',blue:'#8caaa9',cabinet:'#e4e8e1',tile:'#f3f4ee',glass:'#c9dfe8',green:'#a1b59b'} },
  { id:'akdeniz', name:'Akdeniz', description:'Yan duvarda oturma grubu, teras yanında yuvarlak sofra ve doğal dokular.', colors:{lamp:'#fff5dc',floor:'#e7d7bf',wall:'#fbf8ee',wood:'#bb9270',fabric:'#c99173',cushion:'#f6ead6',rug:'#e5cdb0',metal:'#b29379',blue:'#b76f51',cabinet:'#e5d9c2',tile:'#eadfce',glass:'#cee0dc',green:'#8fa481'} },
  { id:'cagdas', name:'Çağdaş', description:'Öne taşınan köşe koltuk, arka bölümde çalışma alanı ve geometrik mobilyalar.', colors:{lamp:'#fff5dc',floor:'#dde4e5',wall:'#fbf8ee',wood:'#b5c6d1',fabric:'#6388bd',cushion:'#e7eff4',rug:'#afc4de',metal:'#405672',blue:'#315fc0',cabinet:'#c9d8e7',tile:'#e9eef2',glass:'#bdd9e6',green:'#8ca89e'} },
]
export function designWeight(index, design) {
  return MathUtils.smoothstep(1-Math.abs(index-design)*2,0,1)
}

// Hold each completed room before the next scroll-controlled transformation.
export function designAtProgress(progress) {
  return MathUtils.smoothstep(progress,.16,.38)+MathUtils.smoothstep(progress,.66,.88)
}
