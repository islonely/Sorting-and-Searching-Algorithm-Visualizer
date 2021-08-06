// doesn't seem to be working right
async function selection_sort() {
    toggle_buttons();

    let items = get_items();
    let l = items.length;
    let swapped = false;
    do {
        swapped = false;
        let min_idx;
        for (let i = 0; i < l-1; i++) {
            min_idx = i;
            for (let j = i+1; j < l; j++) {
                if (items[j].innerText < items[min_idx].innerText) {
                    min_idx = j;
                    swapped = true;
                }

                swap_siblings(items[min_idx], items[i]);
                await sleep(750);
                update_pos();
            }
        }
    } while (swapped);
    update_pos({
        r: 42,
        g: 198,
        b: 128,
        a: 0.8
    });
    toggle_buttons();
}

// sorts the items using the bubble sort algorithm
async function bubble_sort(desc=false) {
    toggle_buttons();

    let items = get_items();
    let l = items.length;
    let swapped = false;
    do { // start sorting and continue to iterate over items until sorted
        swapped = false;
        for (let i = 0; i < l-1; i++) {
            // values to be sorted (this works for text based items as well)
            let x = items[i].innerText;
            let y = items[i+1].innerText;
            
            // will sort in ascending or descending order based on passed parameter
            if (!desc == (x > y)) {
                swap_siblings(items[i], items[i+1]);
                swapped = true;
                // sleep so our eyes aren't overwhelmed by everything being sorted instantly
                await sleep(750);   // min sleep time is equal to last timeout in swap_siblings
            }

            update_pos();
            // idk if this is needed or if the DOM will update items automatically
            // but I wanted to make sure items was updated after we rearranged DOM elements
            items = get_items();
        }
    } while (swapped);
    // changes the color of div.sortable items to a shade
    // of green to signify that we're done sorting
    update_pos({
        r: 42,
        g: 198,
        b: 128,
        a: 0.8
    });
    toggle_buttons();
}

async function linear_search(search_for) {
    // obviously we need a target item to search for
    if (search_for === undefined) {
        console.error('Err: Must search for an item in linear_search(...)');
        return;
    }

    let items = get_items();
    for (let i = 0; i < items.length; i++) {
        let clr_changer = new NodeColorChanger(items[i], WORKING_COLOR);
        clr_changer.change_color();
        
        if (items[i].innerText == search_for) {
            clr_changer.change_color(FINISHED_COLOR);
            break;
        }

        await sleep(750);
        clr_changer.revert_color();
    }
}