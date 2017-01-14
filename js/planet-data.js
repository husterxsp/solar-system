/**
 * 各大行星数据
 * 太阳、水星、金星、地球、火星、木星、土星、天王星、海王星、冥王星
 * 为了便于显示，部分真实数据做了调整，如太阳半径应为109
 * rotRadius 自转半径, 单位 6378
 * rotPeriod 自转周期, 负值代表自转为顺时针
 * revRadius 公转半径, 单位 1.496 x 10^8，
 * revPeriod 公转周期
 * texture   纹理图片
 * ring      外环
 * orbitIncl 轨道倾角
 * 
 */

var planets = [{
    name: 'Sun',
    rotRadius: 5,
    rotPeriod: 10,
    revRadius: 0,
    revPeriod: 0,
    texture: '../img/sun.jpg',
}, {
    name: 'Mercury',
    rotRadius: 1,
    rotPeriod: 20,
    revRadius: 1,
    revPeriod: 24,
    texture: '../img/mercury.jpg',
    orbitIncl: 0,
}, {
    name: 'Venus',
    rotRadius: 1,
    rotPeriod: -10,
    revRadius: 2,
    revPeriod: 61,
    texture: '../img/venus.jpg',
    orbitIncl: 0
}, {
    name: 'Earth',
    rotRadius: 1,
    rotPeriod: 100,
    revRadius: 3,
    revPeriod: 100,
    texture: '../img/earth.jpg',
    orbitIncl: 0
}, {
    name: 'Mars',
    rotRadius: 1,
    rotPeriod: 10,
    revRadius: 4,
    revPeriod: 188,
    texture: '../img/mars.jpg',
    orbitIncl: 0
}, {
    name: 'Jupiter',
    rotRadius: 2.5,
    rotPeriod: 4,
    revRadius: 5,
    revPeriod: 1180,
    texture: '../img/mercury.jpg',
    orbitIncl: 0
}, {
    name: 'Saturn',
    rotRadius: 2,
    rotPeriod: 5,
    revRadius: 6,
    revPeriod: 1800,
    texture: '../img/saturn.jpg',
    ring: '../img/saturnring.jpg',
    orbitIncl: 0
}, {
    name: 'Uranus',
    rotRadius: 1.5,
    rotPeriod: 7,
    revRadius: 7,
    revPeriod: 2200,
    texture: '../img/uranus.jpg',
    ring: '../img/uranusring.jpg',
    orbitIncl: 0
}, {
    name: 'Neptune',
    rotRadius: 1.3,
    rotPeriod: 7,
    revRadius: 8,
    revPeriod: 2800,
    texture: '../img/neptune.jpg',
    orbitIncl: 0
}, {
    name: 'Pluto',
    rotRadius: 1,
    rotPeriod: -6,
    revRadius: 9,
    revPeriod: 3500,
    texture: '../img/pluto.jpg',
    orbitIncl: 0
}];
