// One source for the paper drawings and the live architectural model.
export const projectLines = [
  [[-.675, -.61], [.975, -.61]], [[.975, -.61], [.975, .63]],
  [[.975, .63], [-.675, .63]], [[-.675, .63], [-.675, -.61]],
  [[.15, -.61], [.15, -.18]], [[.15, .07], [.15, .63]],
  [[-.675, .07], [-.26, .07]], [[-.04, .07], [.15, .07]],
  [[.15, .27], [.56, .27]], [[.77, .27], [.975, .27]],
  [[.56, .27], [.56, .63]],
]
export const floorHeight = .285
export const modelBase = .087
export const storeys = 7
export const grid = { x: -.675, z: -.61, width: 1.65 / 4, depth: 1.24 / 3 }
const omissions = [[], ['0:2'], ['0:2','3:0'], ['3:0'], ['3:0','3:2'], ['3:2','0:0'], ['3:2','0:0','0:2']]
export const cells = Array.from({length:12},(_,i)=>[i%4,Math.floor(i/4)])
export const footprints = omissions.map(missing=>new Set(cells.filter(([x,z])=>!missing.includes(`${x}:${z}`)).map(([x,z])=>`${x}:${z}`)))
export function perimeter(footprint) {
  const lines=[]
  cells.forEach(([x,z])=>{
    if(!footprint.has(`${x}:${z}`))return
    const l=grid.x+x*grid.width,r=l+grid.width,n=grid.z+z*grid.depth,s=n+grid.depth
    if(!footprint.has(`${x-1}:${z}`))lines.push([[l,n],[l,s]])
    if(!footprint.has(`${x+1}:${z}`))lines.push([[r,s],[r,n]])
    if(!footprint.has(`${x}:${z-1}`))lines.push([[r,n],[l,n]])
    if(!footprint.has(`${x}:${z+1}`))lines.push([[l,s],[r,s]])
  })
  return lines
}
