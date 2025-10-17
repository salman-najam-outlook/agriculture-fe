<template>
    <v-dialog v-model="show" max-width="900" persistent>
      <v-card>
        <v-card-title class="justify-end">
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
  
        <v-card-text>
          <!-- Main Media Display -->
          <div v-if="file" class="media-preview mb-6">
            <img
              v-if="(file.file_type?.startsWith('image') || file.type?.startsWith('image'))"
              :src="file.s3_url || getLocalFileUrl(file)"
              alt="Preview Image"
              class="main-media"
            />
            <img
              v-else-if="((file.file_type?.startsWith('video') || file.type?.startsWith('video')) && file._thumbnailUrl)"
              :src="file._thumbnailUrl"
              alt="Video Thumbnail"
              class="main-media"
            />
            <video
              v-else-if="(file.file_type?.startsWith('video') || file.type?.startsWith('video'))"
              :src="file.s3_url || getLocalFileUrl(file)"
              controls
              class="main-media"
              style="background: #000;"
            />
            <audio
              v-else-if="(file.file_type?.startsWith('audio') || file.type?.startsWith('audio'))"
              :src="file.s3_url || getLocalFileUrl(file)"
              controls
              style="width: 100%;"
            />
            <v-alert v-else type="info" dense>
                {{ $t('carbonCredit.filePreviewNotAvailable') }}
            </v-alert>
          </div>
  
          <!-- Thumbnail Slider -->
          <v-slide-group
            show-arrows
            class="attachment-slider"
            center-active
          >
            <v-slide-item
              v-for="item in allFiles"
              :key="item.id || item.name"
              :value="item"
            >
              <div
                class="thumbnail-box"
                :class="{ active: (item.id && item.id === file?.id) || (item.name && item.name === file?.name) }"
                @click="$emit('update:media', item)"
                style="position: relative;"
              >
                <img
                  v-if="(item.file_type?.startsWith('image') || item.type?.startsWith('image'))"
                  :src="item.s3_url || getLocalFileUrl(item)"
                  class="thumb-img"
                />
                <template v-else-if="(item.file_type?.startsWith('video') || item.type?.startsWith('video'))">
                  <video
                    :src="item.s3_url || getLocalFileUrl(item)"
                    class="thumb-img"
                    style="background: #000;"
                    muted playsinline preload="metadata"
                  ></video>
                  <v-icon
                    class="play-overlay"
                    style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 36px; color: white; text-shadow: 0 0 8px #000; pointer-events: none;"
                    large
                  >mdi-play-circle</v-icon>
                </template>
                <div
                  v-else-if="(item.file_type?.startsWith('audio') || item.type?.startsWith('audio'))"
                  class="audio-thumbnail-modal"
                >
                  <div class="audio-waveform-modal">
                    <div class="waveform-bars-modal">
                      <div v-for="i in 15" :key="i" class="waveform-bar-modal" :style="{ height: getRandomHeight() + '%' }"></div>
                    </div>
                  </div>
                  <div class="audio-info-modal">
                    <v-icon class="audio-icon-modal">mdi-microphone</v-icon>
                    <span class="audio-duration-modal">{{ getAudioDuration(item) }}</span>
                  </div>
                </div>
                <span v-else class="text-caption">{{ item.file_name || item.name }}</span>
              </div>
            </v-slide-item>
          </v-slide-group>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: "MultimediaModal",
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      file: {
        type: [Object, File],
        default: () => null,
      },
      allFiles: {
        type: Array,
        default: () => [],
      },
    },
    beforeDestroy() {
      this.pauseAllMedia();
    },
    watch: {
      show(val) {
        if (!val) {
          this.pauseAllMedia();
          this.$emit("close");
        }
      },
    },
    methods: {
      getLocalFileUrl(file) {
        if (file instanceof File) {
          if (!file._localUrl) {
            file._localUrl = URL.createObjectURL(file);
          }
          return file._localUrl;
        }
        return null;
      },
      getRandomHeight() {
        return Math.floor(Math.random() * 60) + 20; // Random height between 20% and 80%
      },
      getAudioDuration(file) {
        // Return cached duration if available
        if (file._audioDuration) {
          return file._audioDuration;
        }
        
        // For new files, extract duration
        if (file instanceof File && file.type.startsWith('audio')) {
          const audio = new Audio();
          audio.src = URL.createObjectURL(file);
          
          audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            file._audioDuration = `${minutes}.${seconds.toString().padStart(2, '0')}`;
            this.$forceUpdate(); // Force re-render to show the duration
          });
          
          // Return placeholder while loading
          return '0.00';
        }
        
        // For existing files from backend, try to extract from metadata
        if (file.duration) {
          const minutes = Math.floor(file.duration / 60);
          const seconds = Math.floor(file.duration % 60);
          return `${minutes}.${seconds.toString().padStart(2, '0')}`;
        }
        
        // Fallback for files without duration info
        return '0.00';
      },

      closeModal() {
        this.pauseAllMedia();
        this.$emit('close');
      },
      pauseAllMedia() {
        // Pause all video elements in the modal
        const videos = this.$el.querySelectorAll('video');
        videos.forEach(video => {
          if (!video.paused) {
            video.pause();
          }
        });
        
        // Pause all audio elements in the modal
        const audios = this.$el.querySelectorAll('audio');
        audios.forEach(audio => {
          if (!audio.paused) {
            audio.pause();
          }
        });
        
        // Also pause any media elements in thumbnail sliders
        const thumbnailVideos = this.$el.querySelectorAll('.thumbnail-box video');
        thumbnailVideos.forEach(video => {
          if (!video.paused) {
            video.pause();
          }
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .media-preview {
    display: flex;
    justify-content: center;
  }
  .main-media {
    max-width: 100%;
    border-radius: 12px;
    max-height: 400px;
    object-fit: contain;
  }
  .attachment-slider {
    display: flex;
    margin-top: 20px;
  }
  .thumbnail-box {
    width: 100px;
    height: 75px;
    border-radius: 6px;
    margin-right: 12px;
    overflow: hidden;
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .thumbnail-box.active {
    border-color: #4caf50;
  }
  .thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Audio thumbnail styles for modal */
  .audio-thumbnail-modal {
    width: 100%;
    height: 100%;
    background: #e8f5e8;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .audio-waveform-modal {
    width: 80%;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }
  
  .waveform-bars-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1px;
    width: 100%;
    height: 100%;
  }
  
  .waveform-bar-modal {
    background: #2e7d32;
    width: 2px;
    border-radius: 1px;
    transition: height 0.3s ease;
  }
  
  .audio-info-modal {
    position: absolute;
    bottom: 4px;
    left: 4px;
    right: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .audio-icon-modal {
    color: #2e7d32;
    font-size: 12px;
  }
  
  .audio-duration-modal {
    color: #2e7d32;
    font-size: 10px;
    font-weight: 500;
  }
  

  </style>