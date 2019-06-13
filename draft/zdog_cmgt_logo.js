class App {
    constructor(){
        this.logo = new Zdog.Illustration({
            element: '#logo',
        })

        let vectors = this.generateVectors()

        this.boxes = []

        for (let targetvector of vectors) {

            let startvector = new Zdog.Vector({ x: Math.random() * 800 - 400, y: Math.random() * 600 - 300, z: Math.random() * 300 - 150 })

            let box = new Zdog.Box({
                addTo: this.logo,
                width: 20,
                height: 20,
                depth: 20,
                translate: startvector,
                stroke: false,
                color: '#C25',
                leftFace: '#EA0',
                rightFace: '#E62',
                topFace: '#ED0',
                bottomFace: '#636',
            })

            this.boxes.push({
                box,
                startvector,
                targetvector
            });
        }
        this.logo.rotate.x = 0.4
        this.logo.rotate.y += 0.3

        this.current = 0
        this.counter = 0
        this.update()
    }

    update() {
        this.counter += 0.025

        this.logo.rotate.y += 0.01
        this.logo.updateRenderGraph()

        if(this.counter > 0.65) {
            this.counter = 0
            this.current++
        }

        if (this.current < this.boxes.length) {
            let box = this.boxes[this.current]
            box.box.translate = box.startvector.lerp(box.targetvector, this.counter)
        }

        requestAnimationFrame(()=>this.update())
    }

    generateVectors() {
        let c = [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1]
        ]

        let m = [
            [1, 0, 0, 0, 1],
            [1, 1, 0, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1]
        ]

        let g = [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 1]
        ]

        let t = [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ]

        let letters = []
        letters = letters.concat(this.generateLetter(c, 0))
        letters = letters.concat(this.generateLetter(m, 4))
        letters = letters.concat(this.generateLetter(g, 10))
        letters = letters.concat(this.generateLetter(t, 14))
        return letters
    }

    generateLetter(c, pos) {
        let arr = []
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < c[row].length; col++) {
                if (c[row][col] == 1) {
                    let vector = new Zdog.Vector({ x: col * 20 + pos * 20 - 180, y: row * 20, z: 0 })
                    arr.push(vector)
                }
            }
        }
        return arr
    }
}

new App()
