import { isVue2 } from "vue-demi"
import LuckyWheel from "./components/LuckyWheel"
import LuckyGrid from "./components/LuckyGrid"

const install = (app: { component: Function }) => {
  app.component('LuckyWheel', LuckyWheel)
  app.component('LuckyGrid', LuckyGrid)
}

if (typeof window !== 'undefined' && (window as any).Vue && isVue2) {
  install((window as any).Vue)
}

export { install, LuckyWheel, LuckyGrid }
export default { install }
