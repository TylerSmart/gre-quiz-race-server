import { httpServer } from './app';
import { environment } from './config/environment';

httpServer.listen(environment.PORT);
