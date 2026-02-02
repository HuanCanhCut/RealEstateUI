import tippy, { createSingleton } from 'tippy.js/headless'

import forwardRef from '../forwardRef'
import TippyGenerator from '../Tippy'
import useSingletonGenerator from '../useSingleton'

const useSingleton = useSingletonGenerator(createSingleton)

export default forwardRef(TippyGenerator(tippy), { render: () => '' })
export { tippy, useSingleton }
