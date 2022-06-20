<template>
  <div>
    <slot name="default">
      Child에서 보내는 Default Value! <br />
      Slot에 값을 보내지 않은 경우 출력됩니다.
    </slot>
  </div>
</template>
