<script>
    import ProgramTile from "../../lib/components/xp/ProgramTile.svelte";
    import { SortableList } from '@jhubbardsf/svelte-sortablejs';
    import { runningPrograms } from '../../lib/store';
</script>

<SortableList animation={200} class="h-full grow flex flex-row justify-start pt-1 overflow-hidden">
    {#each $runningPrograms as program}
        <ProgramTile program={program}></ProgramTile>
    {/each}
</SortableList>