import tippy, { createSingleton } from 'tippy.js'

import forwardRef from './forwardRef'
import TippyGenerator from './Tippy'
import useSingletonGenerator from './useSingleton'

const useSingleton = useSingletonGenerator(createSingleton)

export default forwardRef(TippyGenerator(tippy))
export { tippy, useSingleton }
