<template>
  <div>
    <div
      ref="slider"
      class="relative h-14 rounded-full bg-base-200 overflow-hidden select-none"
      style="touch-action: none"
    >
      <!-- Progress -->
      <div
        class="absolute inset-y-0 left-0"
        :class="[`bg-${color}`, dragging ? '' : 'transition-all duration-200']"
        :style="{ width: progress + '%' }"
      ></div>

      <!-- Text -->
      <h1
        class="absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none"
        :class="[installed ? 'text-success' : 'texopacity-70', dragging ? `text-${color}-content`:  '']"
      >
        {{ installed ? successLabel : label }}
      </h1>

      <!-- Knob -->
      <div
        ref="knob"
        class="absolute top-1 left-1 w-12 h-12 rounded-full bg-base-100 shadow-xl flex items-center justify-center"
        :class="[
          `text-${color}`,
          dragging ? '' : 'transition-transform duration-200',
          disabled || installed ? 'cursor-not-allowed' : 'cursor-pointer'
        ]"
        @pointerdown="startDrag"
        @pointermove="onMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <span v-if="!installed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            >
              <path
                stroke-dasharray="60"
                d="M21 12c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9Z"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.6s"
                  values="60;0"
                />
              </path>
              <path stroke-dasharray="12" stroke-dashoffset="12" d="M7 12h9.5">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.7s"
                  dur="0.2s"
                  to="0"
                />
              </path>
              <path
                stroke-dasharray="8"
                stroke-dashoffset="8"
                d="M17 12l-4 4M17 12l-4 -4"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.9s"
                  dur="0.2s"
                  to="0"
                />
              </path>
            </g>
          </svg>
        </span>
        <span v-else>✓</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from "vue";

  const props = defineProps({
    label: { type: String, default: "Slide to confirm" },
    successLabel: { type: String, default: "Completed" },
    color: { type: String, default: "primary" },
    threshold: { type: Number, default: 90 },
    disabled: { type: Boolean, default: false }
  });

  const emit = defineEmits(["complete"]);

  const slider = ref(null);
  const knob = ref(null);

  const progress = ref(0);
  const installed = ref(false);
  const dragging = ref(false);

  let max = 0;

  onMounted(async () => {
    await nextTick();
    max = slider.value.offsetWidth - knob.value.offsetWidth;
  });

  const startDrag = e => {
    if (installed.value || props.disabled) return;

    dragging.value = true;
    knob.value.setPointerCapture(e.pointerId);
  };

  const onMove = e => {
    if (!dragging.value) return;

    const rect = slider.value.getBoundingClientRect();
    let offset = e.clientX - rect.left - knob.value.offsetWidth / 2;

    offset = Math.max(0, Math.min(offset, max));

    progress.value = (offset / max) * 100;
    knob.value.style.transform = `translateX(${offset}px)`;
  };

  const endDrag = e => {
    if (!dragging.value) return;

    dragging.value = false;
    knob.value.releasePointerCapture(e.pointerId);

    if (progress.value >= props.threshold) {
      progress.value = 100;
      knob.value.style.transform = `translateX(${max}px)`;
      installed.value = true;
      emit("complete");
    } else {
      progress.value = 0;
      knob.value.style.transform = `translateX(0px)`;
    }
  };
</script>
