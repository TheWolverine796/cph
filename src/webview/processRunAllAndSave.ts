import { Problem } from '../types';
import { runSingleAndSave } from './processRunSingleAndSave';
import { extensionToWebWiewMessage } from './webview';
import { compileFile, getBinSaveLocation } from '../compiler';
import { deleteBinary } from '../executions';
import { getLanguage } from '../utils';

/**
 * Run every testcase in a problem one by one. Waits for the first to complete
 * before running next. `runSingleAndSave` takes care of saving.
 **/
export default async (problem: Problem) => {
    console.log('Run all started', problem);
    const didCompile = await compileFile(problem.srcPath);
    if (!didCompile) {
        return;
    }
    for (const testCase of problem.tests) {
        extensionToWebWiewMessage({
            command: 'running',
            id: testCase.id,
            problem: problem,
        });
        await runSingleAndSave(problem, testCase.id, true);
    }
    console.log('Run all finished');
    deleteBinary(
        getLanguage(problem.srcPath),
        getBinSaveLocation(problem.srcPath),
    );
};