import { Omnibus } from 'omnibus-rxjs'
export const bus = new Omnibus()
// Just for debugging..
// Log all actions
bus.spy(e => console.log(e))
// Log any listener errors
bus.errors.subscribe(err => console.error(err))
