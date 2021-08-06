// the width of sorting container. Nine items take up about 1020px 
// and instead of coding in a row wrapper I just make it switch to
// a column instaed
const MAX_WIDTH = 1020;
const WORKING_COLOR = new Color(42, 157, 143, 0.8);
const FINISHED_COLOR = new Color(42, 198, 128, 0.8);

window.onload = update_pos;
window.onresize = update_pos;

// update_pos adjusts the position of div.sortable items
// in accordance with the screen size
function update_pos(color = undefined) {
    let items = get_items();

    let i = 0;
    items.forEach((item) => {
        // is screen under MAX_WIDTH
        let isSmoll = window.matchMedia('(max-width: ' + MAX_WIDTH + 'px)').matches;
        // amount of space to shift each cell to the left multiplier
        let left_mult = 90;
        // amount of space to shift each cell to the top multipier
        let top_mult = 45;

        // Only apply left position shift if we are on bigger screens.
        // CSS aligns in column instead of rows for smaller screens.
        isSmoll ? (item.style.left = '10%') : (item.style.left = (i * left_mult) + 'px')
        !isSmoll ? (item.style.top = '0px') : (item.style.top = (i * top_mult) + 'px')

        // change the color of the item
        if (color !== undefined && !(color.r === undefined || color.g === undefined || color.b === undefined)) {
            if (color.a === undefined) color.a = 1.0;
            let r = color.r,
                g = color.g,
                b = color.b,
                a = color.a;
            item.style.background = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.8)';
            // automatically set the border to a slightly darker color than the one provided
            item.style.border = '1px solid rgba(' + (r-4) + ', ' + (g-70) + ', ' + (b-45) + ', ' + (a+0.1) + ')';
        }
        
        i++
    });
}

function Color(r=0, g=0, b=0, a=1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

function Border(thickness=0, type=solid, color=new Color()) {
    this.thickness = thickness;
    this.type = type;
    this.color = color;
}

function NodeColorChanger(node, quick_color=null, has_border=true) {
    if (node === undefined) {
        console.error('Err: node is required in new NodeColorChanger(...)');
        return;
    }

    this.node = node;
    this.initial_color = node.style.background;
    this.initial_border = node.style.border;
    this.quick_color = quick_color;
    this.has_border = has_border;

    this.change_color = function(color=this.quick_color) {
        if (color == null) {
            console.error('Err: new Color(...) must be provided to NodeColorChanger.change_color(...)');
            return;
        }

        this.node.style.background = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
        if (this.has_border) {
            this.node.style.border = '1px solid rgba(' + (color.r-4) + ', ' + (color.g-70) + ', ' + (color.b-45) + ', ' + (color.a+0.1) + ')';
        }
    }

    this.revert_color = function() {
        this.node.style.background = this.initial_color;
        this.node.style.border = this.initial_border;
    }
    
    this.flash_color = function(color=this.quick_color) {
        if (color == null) {
            console.error('Err: new Color(...) must be provided to NodeColorChanger.flash_color(...)');
            return;
        }

        this.change_color(color);
        setTimeout(_ => this.revert_color(), 350);
    }
}

// swaps siblings
function swap_siblings(node1, node2) {
    // change color of items swapping so user can easily see what's happening
    // let tmpclr = node1.style.background;
    // let tmpbrd = node1.style.border;
    // node1.style.background = node2.style.background = 'rgba(42, 157, 143, 0.8)';
    // node1.style.border = node2.style.border = '1px solid rgba(38, 70, 83, 0.9)';

    // visually swap items

    // // change the color back to the original after swapping
    // setTimeout(function() {
    //     node1.style.background = node2.style.background = tmpclr;
    //     node1.style.border = node2.style.border = tmpbrd;
    // }, 350);

    let clr_changer1 = new NodeColorChanger(node1, WORKING_COLOR);
    let clr_changer2 = new NodeColorChanger(node2, WORKING_COLOR);
    clr_changer1.flash_color();
    clr_changer2.flash_color();

    // visually swap items
    let from = window.matchMedia('(max-width: ' + MAX_WIDTH + 'px)').matches ? 'top' : 'left';
    let tmp = node1.style[from];
    node1.style[from] = node2.style[from];
    node2.style[from] = tmp;

    // actually replace the order of the items in the markup so next time
    // javascript fetches div.sortable they will be updated there as well.
    setTimeout(function() {
        node1.parentNode.replaceChild(node1, node2);
        node1.parentNode.insertBefore(node2, node1);
    }, 500);
}

// allows asynchronous functions to sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// toggle_buttons prevents the end user from starting the sort process
// multiple times before the previous one finishes
function toggle_buttons() {
    document.querySelectorAll('div#button_container button').forEach(item => item.disabled = !item.disabled);
}

function get_items() {
    return document.querySelectorAll('div.sortable');
}