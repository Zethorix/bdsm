import * as Comlink from 'comlink';
import * as Simulator from './simulator';

const worker = {
    runDungeon: (team, waves, numRuns) => {
        return Simulator.runMany(team, waves, numRuns);
    }
}

Comlink.expose(worker)