var Rand = {
    seed: false,
    generator: function () { }, // will be initialized;
    value: function () {
        if (!Rand.seed) Rand.init();
        return Rand.generator();
    },
    valueBetween: function (min, max) {
        return Rand.value() * (max - min) + min;
    },
    test: function () {
        methods = [Rand.mulberry16, Rand.mulberry16, Rand.sfc32];
        phrases = ['test', 'rand', 'test', 'random']; // repeated phrases to ensure consitence
        result = [];
        for (var m in methods) {
            for (var p in phrases) {
                Rand.init(phrases[p], methods[m]);
                var test = { 'Method': methods[m].name, 'Phrase': phrases[p], 'values': [] };
                for (var i = 0; i < 10; i++) {
                    var v = Rand.value();
                    test.values.push(v);
                }
                result.push(test);
            }
        }
        console.log(JSON.stringify(result));
    },
    mulberry32: function (seed) {
        return function () {
            seed = (seed + 0x9e3779b9) | 0;
            let z = seed;
            z ^= z >>> 16;
            z = Math.imul(z, 0x21f0aaad);
            z ^= z >>> 15;
            z = Math.imul(z, 0x735a2d97);
            z ^= z >>> 15;
            return z;
        }
    },
    mulberry16: function (a) {
        return function () {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    },
    sfc32: function (a, b, c, d) {
        return function () {
            a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
            var t = (a + b) | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            d = d + 1 | 0;
            t = t + d | 0;
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        }
    },
    xoshiro128ss: function (a, b, c, d) {
        return function () {
            var t = b << 9, r = b * 5; r = (r << 7 | r >>> 25) * 9;
            c ^= a; d ^= b;
            b ^= c; a ^= d; c ^= t;
            d = d << 11 | d >>> 21;
            return (r >>> 0) / 4294967296;
        }
    },
    jsf32: function (a, b, c, d) {
        return function () {
            a |= 0; b |= 0; c |= 0; d |= 0;
            var t = a - (b << 27 | b >>> 5) | 0;
            a = b ^ (c << 17 | c >>> 15);
            b = c + d | 0;
            c = d + t | 0;
            d = a + t | 0;
            return (d >>> 0) / 4294967296;
        }
    },
    cyrb128: function (str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
        return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
    },
    init: function ($phrase, $method) {
        $phrase = $phrase || "Rand";
        $method = $method || Rand.mulberry16;
        var seed = Rand.cyrb128($phrase);
        Rand.seed = seed;
        Rand.generator = $method(Rand.seed[0]);
        //var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);        
    },
    credits: 'http://www.rapttor.com'
}

Rand.test();