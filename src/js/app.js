import HelpDesk from './HelpDesk';
import Requests from './Requests';


const requests = new Requests();
const helpDesk = new HelpDesk(requests);
helpDesk.init();
