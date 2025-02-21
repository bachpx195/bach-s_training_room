<script>
// Price/Time measurment tool

import Overlay from '../../mixins/overlay.js'

export default {
    name: 'Custom',
    mixins: [Overlay],
    data() {
        return {}
    },
    // Define internal setting & constants here
    computed: {
        sett() {
            return this.$props.settings
        },
        p1() {
            return this.$props.settings.p1
        },
        p2() {
            return this.$props.settings.p2
        },
        line_width() {
            return this.sett.lineWidth || 0.9
        },
        color() {
            return this.sett.color ||
                this.$props.colors.cross
        },
        back_color() {
            return this.sett.backColor || '#9b9ba316'
        },
        value_back() {
            return this.sett.valueBack || '#9b9ba316'
        },
        value_color() {
            return this.sett.valueColor ||
                this.$props.colors.text
        },
        prec() {
            return this.sett.precision || 2
        },
        new_font() {
            return '12px ' + this.$props.font.split('px').pop()
        },
        price() {
            return 'price' in this.sett ? this.sett.price : true
        },
        time() {
            return 'time' in this.sett ? this.sett.time : false
        },
        shift() {
            return this.sett.shiftMode
        }
    },
    methods: {
        meta_info() {
            return { author: 'C451', version: '2.0.1' }
        },
        draw(ctx) {
            console.log("p1", this.$props.data)
            const p1 = this.$props.data[0]
            const p2 = this.$props.data[1]
            const openLinePoint1 = this.$props.data[2]
            const openLinePoint2 = this.$props.data[3]
            const highLinePoint1 = this.$props.data[4]
            const highLinePoint2 = this.$props.data[5]
            const lowLinePoint1 = this.$props.data[6]
            const lowLinePoint2 = this.$props.data[7]
            
            const layout = this.$props.layout

            ctx.lineWidth = this.line_width
            ctx.strokeStyle = this.color

            // Background
            ctx.fillStyle = this.back_color
            let x1 = layout.t2screen(p1[0])
            let y1 = layout.$2screen(p1[1])
            let x2 = layout.t2screen(p2[0])
            let y2 = layout.$2screen(p2[1])
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1)

            let w = layout.width
            let s = Math.sign(x2 - x1 || y2 - y1)
            let dx = w * s /10
            // Open line
            let openLineX1 = layout.t2screen(openLinePoint1[0])
            let openLineY1 = layout.$2screen(openLinePoint1[1])
            let openLineX2 = layout.t2screen(openLinePoint2[0])
            let openLineY2 = layout.$2screen(openLinePoint2[1])

            ctx.beginPath()
            ctx.moveTo(openLineX1, openLineY1)
            ctx.lineTo(openLineX2 + dx, openLineY2)
            ctx.strokeStyle = "#FFFF00"
            ctx.stroke();

            // High Line
            let highLineX1 = layout.t2screen(highLinePoint1[0])
            let highLineY1 = layout.$2screen(highLinePoint1[1])
            let highLineX2 = layout.t2screen(highLinePoint2[0])
            let highLineY2 = layout.$2screen(highLinePoint2[1])

            ctx.beginPath()
            ctx.moveTo(highLineX1, highLineY1)
            ctx.lineTo(highLineX2 + dx, highLineY2)
            ctx.strokeStyle = "#42b28a"
            ctx.stroke();

            // Low Line
            let lowLineX1 = layout.t2screen(lowLinePoint1[0])
            let lowLineY1 = layout.$2screen(lowLinePoint1[1])
            let lowLineX2 = layout.t2screen(lowLinePoint2[0])
            let lowLineY2 = layout.$2screen(lowLinePoint2[1])

            ctx.beginPath()
            ctx.moveTo(lowLineX1, lowLineY1)
            ctx.lineTo(lowLineX2 + dx, lowLineY2)
            ctx.strokeStyle = "#ff2316"
            ctx.stroke();
        },
        // Formats time from ms to `1D 12h` for example
        t2str(t) {
            let sign = Math.sign(t)
            let abs = Math.abs(t)
            let tfs = [
                [1000, 's', 60],
                [60000, 'm', 60],
                [3600000, 'h', 24],
                [86400000, 'D', 7],
                [604800000, 'W', 4],
                [2592000000, 'M', 12],
                [31536000000, 'Y', Infinity],
                [Infinity, 'Eternity', Infinity]
            ]
            for (var i = 0; i < tfs.length; i++) {
                tfs[i][0] = Math.floor(abs / tfs[i][0])
                if (tfs[i][0] === 0) {
                    let p1 = tfs[i - 1]
                    let p2 = tfs[i - 2]
                    let txt = sign < 0 ? '-' : ''
                    if (p1) {
                        txt += p1.slice(0,2).join('')
                    }
                    let n2 = p2 ? p2[0] - p1[0] * p2[2] : 0
                    if (p2 && n2) {
                        txt += ' '
                        txt += `${n2}${p2[1]}`
                    }
                    return txt
                }
            }
        },
        use_for() { return ['Custom'] },
        data_colors() { return [this.color] },
    }

}
</script>
