<script>

  import * as utils from '../../../lib/utils';
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import RadioBtn from '../../../lib/components/xp/RadioBtn.svelte';
  
  let dispatcher = createEventDispatcher();

  let steps = [//2: completed, 1: in progress, 0: not yet
    ['Collecting information', 2],
    ['Dynamic Update', 2],
    ['Preparing Installation', 2],
    ['Installing Windows', 1],
    ['Finalizing installation', 0]
  ];
  
  let total_duration = 7*60*1000;//milliseconds
  let one_unit = total_duration/37;//ie, 1 minute in simulation

  let phases = [
    {t:'Installing Devices', d: 6*one_unit},
    {t:'Installing Network...', d: 2*one_unit},
    {t:'Copying files...', d: 5*one_unit},
    {t:'Completing installation...',d:2*one_unit},
    {t:'Installing Start menu items', d:2*one_unit},
    {t:'Registering components', d: 10*one_unit},
    {t:'Saving settings',d: 7*one_unit},
    {t:'Removing any temporary files used', d: 3*one_unit}
  ];

  let introductions = [
    {
        'heading': 'An exciting new look',
        'text': 'Windows® XP Professional sports a visual design that combines a sleek look, clean lines, and appealing colors with a task-oriented design and exceptionally streamlined navigation.\nThe redesigned Start menu makes it easier to find important information and access the programs you use most frequently.\nBy automatically cleaning up the notification area of the taskbar and grouping related taskbar items, Windows XP makes it easier to switch between programs and to open, view, or close multiple items at the same time.'
    },
    {
        'heading': 'Try the easiest Windows® yet',
        'text': 'Windows XP makes it easy to manage all of your information. We\'ve enhanced the My Documents, My Pictures, and My Music folders to make them more useful. Now whenever you open these folders, you\'ll also see handy shortcuts to the most common tasks for documents, pictures, and music.\nIntegrated support for Web publishing means that you can put your documents on the Internet and get to them easily from any location.\nWindows XP Professional also supports integrated CD recording, so now you can easily save files to a CD-R or CD-RW drive.'
    },
    {
        'heading': 'Stay up to date',
        'text': 'Windows Update provides you with critical software updates and hardware support files for Windows® XP. And Setup gives you the opportunity to ensure that you have the latest software to install Windows quickly and successfully.\nFor corporate customers, there have been great improvements to the system preparation tool as well as unattended setups.'
    },
    {
        'heading': 'Your computer will be faster and more reliable',
        'text': 'Windows® XP Professional not only starts faster than any previous version of Windows, but it also runs your programs more quickly and reliably than ever. If a program becomes unstable, you can close it without having to shut down Windows or lose any of your work.'
    }
  ];
  let intro_index = 0;

  let time_passed = 0;
  let phase_index = 0;
  let current_phase = phases[phase_index];
  current_phase.progress = 0;
  $: time_left = Math.ceil(Math.max(total_duration - time_passed, 0)/(one_unit));
  let destroyed = false;
  let paused = false;

  onMount(async () => {

    update_text();

    


    while(true){
      if(destroyed) break;

      await utils.sleep(current_phase.d/100);
      if(paused) continue;

      current_phase.progress = Math.min(100, current_phase.progress + 1);
      time_passed += current_phase.d/100;
      
      if(time_passed >= total_duration){
        console.log('Done');
        utils.set_installing_windows(false);
        dispatcher('load_page', {url: './xp/starting.svelte'});
        break;
      }

      if(current_phase.progress >= 100 && phase_index < phases.length){

        if(phase_index == 0){
          //show product key windows at the end of phase 0
          const ProductKeyWindows = (await import('./product_key_windows.svelte')).default;
          let product_key_windows = new ProductKeyWindows({target:document.querySelector('#_95-installing-right-side')});
          product_key_windows.on_click_next = () => { paused = false; product_key_windows.$destroy()}
          paused = true;
        }
        phase_index++;
        if(phase_index>=5){
          steps[3][1] = 2;
          steps[4][1] = 1;
        }
        current_phase.progress = 0;
        current_phase = phases[phase_index];
        current_phase.progress = 0;
      }
    }
  })

  onDestroy(() => {
    destroyed = true;
  })

  async function update_text(){
    while(true){
      if(destroyed) break;
      await utils.sleep(4*one_unit);
      if(intro_index < introductions.length - 1){
        intro_index++;
      } else {
        intro_index = 0;
      }
    }
  }
  

</script>

<style>

.indicator {
  display: flex;
  flex-direction:row;
  justify-content: space-between;
  width: fit-content;
}
.indicator > div {
  border-radius: 2px;
  width: 7px;
  height: 7px;
  background: #16a34a;
  margin-right: 20px;
  animation: pulse 2.5s infinite;
}


/* These are the delays */
.indicator > div:nth-child(1) {animation-delay: 0.0s; }
.indicator > div:nth-child(2) {animation-delay: 0.5s; }
.indicator > div:nth-child(3) {animation-delay: 1s; }
.indicator > div:nth-child(4) {animation-delay: 1.5s; }
.indicator > div:nth-child(5) {animation-delay: 2s; }

/* Animation definition */
@keyframes pulse {
  20% {
    box-shadow: 0 0 0 6px #10b981;
  }
}

</style>

<div class="absolute inset-0 overflow-hidden flex flex-col bg-[#5a7edc]">
  <div class="h-[70px] bg-[#00309c] flex flex-row items-center shrink-0">
    <img src="/images/xp_logo_horizontal.png" class="h-[40px] ml-4" alt="" />
  </div>
  <div class="h-[2px] bg-[linear-gradient(45deg,#466dcd,#c7ddff,#b0c9f7,#5a7edc)] shrink-0"></div>
  <div class="grow bg-[radial-gradient(circle_at_5%_5%,#91b1ef_0,#7698e6_6%,#5a7edc_12%)] flex flex-row overflow-hidden">

    <div class="w-1/5 min-w-[300px] pt-12 pointer-events-none">
      {#each steps as step, index}
      <div class="mb-4 ml-12 mr-20 text-white font-bold text-base">
          <RadioBtn checked={step[1] == 2} in_progress={step[1] == 1} size={20} label="{step[0]}"></RadioBtn>
      </div>
      {/each}
      <p class="font-bold text-base mt-6 text-white px-8 mr-4 font-MSSS">Setup will complete in approximately:</p>
      <p class="font-bold text-base text-white mr-12 text-center font-MSSS">
        {time_left} {time_left > 1 ? 'minutes' : 'minute'}
      </p>

      <p class="mt-8 ml-8 text-sm text-white font-MSSS">{current_phase.t}</p>
      <div class="ml-8 mr-10 mt-1 border-[#00309c] border h-6 bg-white p-[1px]">
        <div class="bg-green-600 h-full {0 < current_phase.progress && current_phase.progress < 100 ? 'transition-all': ''}" style:width="{current_phase.progress}%"></div>
      </div>
    </div>
    
    <div class="grow bg-[linear-gradient(#5a7edc,#7698e6,#5a7edc)] relative" id="_95-installing-right-side">
      <div class="p-8 pl-20 pr-24 ">
        <p class="text-3xl text-white font-sans font-bold" style="text-shadow: 2px 2px #000;">{introductions[intro_index].heading}</p>
        <p class="text-lg text-white mt-8  max-w-[700px] font-MSSS">{@html introductions[intro_index].text.split('\n').join('<br/><br/>')}</p>
      </div>
    </div>
  </div>

  <div class="h-[2px] bg-[linear-gradient(45deg,#003399,#f99736,#c2814d,#00309c)] shrink-0"></div>
  <div class="h-[70px] w-full bg-[linear-gradient(90deg,#3833ac,#00309c)] shrink-0 relative">
    <div class="indicator absolute right-10 top-[50%] -translate-y-[50%]">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>

<audio src="/audio/xp_installing.mp3" loop autoplay></audio>