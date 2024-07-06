import { computed } from "@vue/reactivity";
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { VApp, VBtn, VCard, VCardActions, VCardTitle, VContainer, VProgressCircular } from 'vuetify/components';
import colors from 'vuetify/util/colors'
import { VNumberInput } from 'vuetify/labs/VNumberInput';

function parseBoolean(str: any): boolean {
  if (typeof str === 'string') {
    if (str.toLowerCase() === 'false') {
      return false;
    }
    if (str.toLowerCase() === 'true') {
      return true;
    }
  }
  return Boolean(str);
}

export default defineComponent({
  setup() {
    const show = ref(false);

    // isActive
    const _isActive = ref(parseBoolean(sessionStorage.getItem('isActive')));
    const isActive = computed({
      get: () => _isActive.value,
      set: (value) => {
        _isActive.value = value;
        sessionStorage.setItem('isActive', value.toString());
      }
    });

    const _casesCount = ref(+(sessionStorage.getItem('total') || 1));
    const casesCount = computed({
      get: () => _casesCount.value,
      set: (value) => {
        _casesCount.value = value || 0;
        console.log('set casesCount', _casesCount.value);
        sessionStorage.setItem('total', _casesCount.value.toString());
      }
    });

    watch(casesCount, (curr, prev) => {
      if (curr <= 0) isActive.value = false;
    }, { immediate: true });

    const onStartClick = (e: MouseEvent) => {
      e.preventDefault();
      isActive.value = true;
    }

    const onStopClick = (e: MouseEvent) => {
      e.preventDefault();
      isActive.value = false;
    }

    // timer
    const _timeout = ref(15);
    const timer = ref(_timeout.value);
    onMounted(() => {
      const timerInterval = setInterval(updateTimer, 1000);
      onUnmounted(() => { clearInterval(timerInterval); });
      leftClickBehavior();
    });

    const leftClickBehavior = () => {
      let lastRightClickTime = 0;
      const doubleClickThreshold = 300;
      document.body.addEventListener('contextmenu', function () {
        // event.preventDefault();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastRightClickTime;
        if (timeDiff < doubleClickThreshold) {
          show.value = !show.value;
        }
        lastRightClickTime = currentTime;
      });
    };

    watch(isActive, (curr, prev) => {
      if (curr === true && prev === false) {
        timer.value = _timeout.value;
      }
    });

    const updateTimer = () => {
      if (isActive.value && timer.value > 0) {
        timer.value = timer.value - 1;
        if (timer.value <= 0) {
          window.location.reload();
        }
      }
    }

    if (isActive.value) {
      const pageContent = document.body.innerText;
      const success = pageContent.includes('VST_ID');
      if (success) {
        casesCount.value = casesCount.value - 1;
      }
    }

    return () => (
      <VContainer style="width: 500px" v-show={show.value}>
        <VCard class="pa-2" >
          {/* <VCardTitle>Уловлювач справ</VCardTitle> */}
          <VNumberInput v-model={casesCount.value} min={0} max={999} step={5} controlVariant="split" variant="outlined">
            Кількість справ:
          </VNumberInput>
          {isActive.value && (
            <>
              <VProgressCircular size={3} color="green" indeterminate></VProgressCircular>
              Наступне оновлення через {timer.value} секунд
            </>
          )}
          <VCardActions>
            {isActive.value ? (
              <>
                <VBtn onClick={onStopClick} variant="elevated">Зупинити</VBtn>
              </>
            ) : (
              <VBtn onClick={onStartClick} variant="elevated">Розпочати</VBtn>
            )}
          </VCardActions>
        </VCard>
      </VContainer>
    );
  }
});
