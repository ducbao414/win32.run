
export function tooltip(element) {
	
	let comp;
	let timeout;
	function mouseEnter(event) {
		if(event.target !== element) return;
		
		let tooltip_message = element.getAttribute('tooltip');
		if(tooltip_message == null || tooltip_message == '') return;

		comp = document.createElement('div');

		let rect = element.getBoundingClientRect();
		let estimated_width = 150;
		let estimated_height = 30;
		let screen_width = document.body.offsetWidth;
		let screen_height = document.body.offsetHeight;
		
		if(rect.y + rect.height >  screen_height - estimated_height){
			comp.style.bottom = `${rect.height+15}px`;
		} else {
			comp.style.top = `${rect.y + rect.height + 10}px`;
		}

		if(rect.x + rect.width > screen_width - estimated_width){
			comp.style.right = `${20}px`;
		} else {
			comp.style.left = `${rect.x}px`;
		}

		comp.style.maxWidth = '150px';
		comp.style.pointerEvents = 'none';
		comp.style.position = 'absolute';
		comp.style.zIndex = '999';
		comp.style.backgroundColor = '#ece8cf';
		comp.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
		comp.style.overflow = 'hidden';
		comp.style.padding = '4px';
		comp.style.fontFamily = 'MSSS';
		comp.innerHTML = `
			<p class=" line-clamp-1 leading-tight text-ellipsis" style="font-size:11px;">
				${tooltip_message}
			</p>`;

		timeout = setTimeout(() => {
			document.body.appendChild(comp);
			setTimeout(() => {
				comp.remove();
			}, 3000);
		}, 2000);
		
	}
	
	function mouseLeave(event) {
		clearTimeout(timeout);
		if(comp != null){
			comp.remove();
		}
	}
	
	element.addEventListener('mouseenter', mouseEnter);
  	element.addEventListener('mouseleave', mouseLeave);
	
	return {
		destroy() {
			element.removeEventListener('mouseenter', mouseEnter);
			element.removeEventListener('mouseleave', mouseLeave);
		}
	}
}