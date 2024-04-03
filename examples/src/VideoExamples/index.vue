<script setup lang="ts">
import { ref } from 'vue';
import { VideoPlayer } from 'vue-datocms';

const video = ref({
  muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
  title: 'Title',
  width: 1080,
  height: 1920,
  blurUpThumb:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLDhAWDhYQDg0NDhUVFg0OFxUZGBYfFiEaHysjHR0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEA4QEC8dFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABkADgMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAADBAUGAf/EABwQAAICAgMAAAAAAAAAAAAAAAEDAAIEEQUGIf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAIBITH/2gAMAwEAAhEDEQA/AByuKdRJlXTiXWJkfI7bkOprUJPYnAHcSzQXizNl9teCCXuB8EWckUjaf//Z',
});

const videoPlayer = ref();
</script>

<template>
  <div class="example" data-title="Standard behaviour">
    <VideoPlayer
      :data="video"
      :class="{ 'video-player': true }"
      ref="videoPlayer"
    />
  </div>
  <div class="example" data-title="Force to be square, custom accent color">
    <VideoPlayer
      :data="video"
      :style="{ aspectRatio: '1 / 1' }"
      accent-color="#ffff00"
    />
  </div>
  <div
    class="example"
    data-title="Forced aspect ratio, no controls, autoplay, cover"
  >
    <VideoPlayer
      :data="video"
      :style="{
        aspectRatio: '10 / 4',
        '--controls': 'none',
        '--media-object-fit': 'cover',
      }"
      auto-play="muted"
      loop
    />
  </div>
  <div class="example" data-title="No aspect ratio set">
    <VideoPlayer
      :data="video"
      :style="{ aspectRatio: undefined }"
      :disable-cookies="false"
      accent-color="#ffff00"
      :auto-play="'muted'"
      @pause="console.log"
      @playing="console.log"
      controls
    />
  </div>
  
</template>

<style></style>
