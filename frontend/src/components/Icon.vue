<template>
    <svg
        viewBox="0 0 8 8"
        @click="onClick && onClick()"
        v-b-tooltip.hover
        v-bind="{ class: `icon ${classes || ''}`, title }"
    >
        <path v-bind:d="icons[icon]"></path>
    </svg>
</template>

<script>
import icons from '../assets/icons';

export default {
    data: () => ({ icons }),
    props: ['icon', 'classes', 'title', 'onClick'],
};
</script>
