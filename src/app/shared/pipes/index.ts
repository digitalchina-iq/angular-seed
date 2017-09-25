import { IqRefactorPipe } from './iq-refactor.pipe';
import { IqArrayRefactorPipe } from './iq-array-refactor.pipe';
import { IqDatePipe } from './iq-date.pipe';
import { IqFileSizePipe } from './iq-filesize.pipe';

export { IqRefactorPipe, IqArrayRefactorPipe, IqDatePipe, IqFileSizePipe }
export let SHARED_PIPES = [IqFileSizePipe,IqDatePipe,IqRefactorPipe,IqArrayRefactorPipe];
