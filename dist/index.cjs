'use strict';

var jspsych = require('jspsych');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const info = {
    name: "audio-html-button-response",
    parameters: {
        stimulus: {
            type: jspsych.ParameterType.STRING,
            default: null
        },
        choices: {
            type: jspsych.ParameterType.STRING,
            default: null,
            array: true
        },
        audio_stimulus: {
            type: jspsych.ParameterType.AUDIO,
            default: null,
            array: true
        },
        audio_choices: {
            type: jspsych.ParameterType.OBJECT,
            default: null,
            array: true
        },
        audio_stimulus_start_delay: {
            type: jspsych.ParameterType.INT,
            default: 100
        },
        audio_stimulus_break_duration: {
            type: jspsych.ParameterType.INT,
            default: 100
        },
        audio_choice_break_duration: {
            type: jspsych.ParameterType.INT,
            default: 100
        },
        audio_stimulus_autoplay: {
            type: jspsych.ParameterType.BOOL,
            default: true
        },
        audio_stimulus_play_button: {
            type: jspsych.ParameterType.BOOL,
            default: false
        },
        audio_choice_play_button: {
            type: jspsych.ParameterType.BOOL,
            default: true
        },
        button_html: {
            type: jspsych.ParameterType.HTML_STRING,
            default: '<button class="jspsych-btn">%choice%</button>'
        },
        response_ends_trial: {
            type: jspsych.ParameterType.BOOL,
            default: true
        },
        audioend_ends_trial: {
            type: jspsych.ParameterType.BOOL,
            default: false
        },
        trial_duration: {
            type: jspsych.ParameterType.INT,
            default: null
        },
        before_choices: {
            type: jspsych.ParameterType.HTML_STRING,
            default: null
        },
        after_choices: {
            type: jspsych.ParameterType.HTML_STRING,
            default: null
        },
        enable_buttons_after_audio: {
            type: jspsych.ParameterType.INT,
            default: 0
        },
        correct_choice: {
            type: jspsych.ParameterType.INT,
            default: null
        },
        feedback_duration: {
            type: jspsych.ParameterType.INT,
            default: 500
        }
    },
};
/**
 * **Audio-Html-Button-Response**
 *
 * Shows html accompanied by a series of audio
 * Plus (optionally) audio for choices
 *
 * For this to work correctly, you MUST PRELOAD the audio files.
 * This is due to race conditions in jsPsych's lazy-loading
 * in case the files have the same paths.
 *
 * @author Ponrawee Prasertsom
 */
class AudioHtmlButtonResponse {
    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }
    trial(display_element, trial, on_load) {
        return __awaiter(this, void 0, void 0, function* () {
            let audioContext = this.jsPsych.pluginAPI.audioContext();
            // console.log(audioContext);
            let startTime; // records audio context starttime
            let response = {
                button: null,
                rt: null
            }; // stores response
            let audioElements = [];
            let audioBufferSources = [];
            let totalTime;
            let enableButtonsAfterAudio = trial.enable_buttons_after_audio;
            const deepcopy_string = (str) => {
                return (' ' + str).slice(1);
            };
            const get_audio_duration = (audio, buffer = null) => {
                let duration;
                if (audioContext !== null) {
                    duration = audio.buffer.duration;
                }
                else {
                    duration = audio.duration;
                }
                return duration * 1000;
            };
            const create_buffer_list = (fileList) => __awaiter(this, void 0, void 0, function* () {
                let buffers = yield Promise.all(fileList.map(this.jsPsych.pluginAPI.getAudioBuffer));
                return buffers;
            });
            const create_buffer_lists = (fileLists) => __awaiter(this, void 0, void 0, function* () {
                let bufferLists = [];
                for (const fileList of fileLists) {
                    const bufferList = yield create_buffer_list(fileList);
                    bufferLists.push(bufferList);
                }
                return bufferLists;
            });
            const make_audio_from_buffer = (buffer) => new Promise((resolve, reject) => {
                if (audioContext !== null) {
                    let currentAudio = audioContext.createBufferSource();
                    currentAudio.buffer = buffer;
                    currentAudio.connect(audioContext.destination);
                    resolve(currentAudio);
                }
                else {
                    let currentAudio = new Audio();
                    currentAudio.src = deepcopy_string(buffer.src);
                    currentAudio.currentTime = 0;
                    audioElements.push(currentAudio);
                    currentAudio.addEventListener("canplaythrough", function () {
                        resolve(currentAudio);
                    });
                }
            });
            const set_src_to_empty = (event) => {
                event.currentTarget.src = '';
            };
            const play_single_audio = (audio, currentTime, offset = 0, callback = null) => {
                if (audioContext !== null) {
                    audioBufferSources.push(audio);
                    audio.start(currentTime + (offset / 1000));
                }
                else {
                    this.jsPsych.pluginAPI.setTimeout(function () {
                        audio.play();
                    }, offset);
                    audioElements.push(audio);
                    audio.addEventListener('ended', set_src_to_empty, { once: true });
                }
                if (callback !== null) {
                    audio.addEventListener('ended', callback);
                }
            };
            const play_buffer_list = (bufferList, breakDuration, callback = null, initialOffset = 0) => __awaiter(this, void 0, void 0, function* () {
                // callback will be called after the last audio in the list is played
                let offset = initialOffset;
                let currentTime = 0;
                if (audioContext !== null) {
                    currentTime = audioContext.currentTime;
                }
                for (const [idx, buffer] of bufferList.entries()) {
                    const audio = yield make_audio_from_buffer(buffer);
                    if (idx == bufferList.length - 1) {
                        play_single_audio(audio, currentTime, offset, callback);
                    }
                    else {
                        play_single_audio(audio, currentTime, offset);
                    }
                    offset += get_audio_duration(audio) + breakDuration;
                    totalTime = offset;
                }
            });
            const stop_all_audio = (resetPlayButtons = false) => {
                if (audioContext !== null) {
                    audioBufferSources.forEach((bufferSource) => { bufferSource.stop(0); });
                    audioBufferSources = [];
                }
                else {
                    this.jsPsych.pluginAPI.clearAllTimeouts(); // clear all <audio> settimeouts
                    audioElements.forEach((audioElem) => { audioElem.src = ''; audioElem.removeEventListener('ended', set_src_to_empty); });
                    audioElements = [];
                }
                if (resetPlayButtons) {
                    document.querySelectorAll('.jspsych-audio-html-play-button').forEach((el) => {
                        enable_button(el);
                    });
                }
            };
            const play_button_html = (idx, disabled = false) => {
                const dis = (disabled) ? 'disabled' : '';
                let html = '<button';
                html += ' class="jspsych-audio-html-play-button"';
                html += ' id="jspsych-audio-html-play-button-' + idx + '"';
                html += ' data-choice="' + idx + '"';
                html += ' ' + dis;
                html += '>';
                html += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/> </svg>';
                html += '</button>';
                return html;
            };
            const response_button_html = (idx, choice) => {
                let html = '';
                html += '<div class="jspsych-audio-html-response-button-wrapper"';
                html += ' style="display: inline-block;"';
                html += ' id="jspsych-audio-html-response-button-wrapper-' + idx + '"';
                html += ' data-choice="' + idx + '"';
                html += '>';
                html += trial.button_html.replace(/%choice%/g, choice);
                html += '</div>';
                return html;
            };
            const main_html = () => {
                let html = '<div class="jspsych-audio-html">';
                if (!trial.audio_stimulus_autoplay ||
                    trial.audio_stimulus === null) {
                    enableButtonsAfterAudio = -1;
                }
                let initialDisabled = (enableButtonsAfterAudio >= 0);
                if (trial.stimulus !== null) {
                    let stimulus = '<div class="jspsych-audio-html-stimulus">';
                    stimulus += trial.stimulus;
                    if (trial.audio_stimulus_play_button) {
                        if (stimulus.indexOf("%play_button%") !== -1) {
                            stimulus = stimulus.replace(/%play_button%/, play_button_html(-1, initialDisabled));
                        }
                        else {
                            stimulus += play_button_html(-1, initialDisabled);
                        }
                    }
                    stimulus += '</div>';
                    html += stimulus;
                }
                if (trial.choices !== null) {
                    html += '<div class="jspsych-audio-html-button-response">';
                    if (trial.before_choices !== null) {
                        html += trial.before_choices;
                    }
                    for (const [idx, choice] of trial.choices.entries()) {
                        html += '<div class="jspsych-audio-html-button-group">';
                        html += response_button_html(idx, choice);
                        if (trial.audio_choices !== null) {
                            html += play_button_html(idx, initialDisabled);
                        }
                        html += '</div>';
                    }
                    if (trial.after_choices !== null) {
                        html += trial.after_choices;
                    }
                    html += '</div>';
                }
                html += '</div>';
                return html;
            };
            const handle_button_response = (event) => {
                event.preventDefault();
                const btn = event.currentTarget;
                if (btn.disabled !== true) {
                    const btnParent = btn.parentElement;
                    let choice = btnParent.getAttribute('data-choice');
                    handle_choice(choice);
                    if (trial.response_ends_trial) {
                        // disable all buttons
                        disable_all_buttons();
                        if (trial.correct_choice !== null && trial.feedback_duration !== -1) {
                            btn.classList.add('chosen');
                            const correctBtn = document.querySelector('#jspsych-audio-html-response-button-wrapper-' + choice + ' button');
                            correctBtn.classList.add('correct');
                            if (trial.correct_choice !== choice) {
                                btn.classList.add('incorrect');
                            }
                            this.jsPsych.pluginAPI.setTimeout(() => { end_trial(); }, trial.feedback_duration);
                        }
                        else {
                            end_trial();
                        }
                    }
                }
            };
            const handle_choice = (choice) => {
                let endTime = performance.now();
                let rt = Math.round(endTime - startTime);
                response.rt = rt;
                response.button = parseInt(choice, 10);
            };
            const enable_button = (element, activeClass = 'active') => {
                element.disabled = false;
                element.style.visibility = 'visible';
                element.classList.remove(activeClass);
            };
            const enable_all_buttons = () => {
                const btns = document.querySelectorAll('.jspsych-audio-html button');
                for (let i = 0; i < btns.length; i++) {
                    const btn = btns[i];
                    enable_button(btn);
                }
            };
            const disable_button = (element, activeClass = 'active') => {
                element.disabled = true;
                element.classList.add(activeClass);
            };
            const disable_all_buttons = () => {
                const btns = document.querySelectorAll('.jspsych-audio-html button');
                for (let i = 0; i < btns.length; i++) {
                    const btn = btns[i];
                    disable_button(btn);
                }
            };
            const enable_button_wrap = (element) => {
                return function () {
                    return enable_button(element);
                };
            };
            const enable_buttons_after_audio = () => {
                if (enableButtonsAfterAudio >= 0) {
                    this.jsPsych.pluginAPI.setTimeout(() => {
                        enable_all_buttons();
                        initialise_button_events();
                    }, enableButtonsAfterAudio);
                }
            };
            const handle_play_button = (event) => {
                const element = event.currentTarget;
                const choiceIdx = parseInt(element.getAttribute('data-choice'), 10);
                stop_all_audio(true); // stop all currently scheduled/playing sounds
                if (choiceIdx === -1) {
                    // play the stimulus
                    play_buffer_list(this.stimulusBuffers, trial.audio_stimulus_break_duration, enable_button_wrap(element));
                }
                else {
                    play_buffer_list(this.choiceBuffers[choiceIdx], trial.audio_choice_break_duration, enable_button_wrap(element));
                }
                disable_button(element);
            };
            const end_trial = () => {
                // stop any current audio
                stop_all_audio();
                // clear any remaining timeouts
                this.jsPsych.pluginAPI.clearAllTimeouts();
                let trialData = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    audio_stimulus: trial.audio_stimulus,
                    choices: trial.choices,
                    audio_choices: trial.audio_choices,
                    response: response.button,
                };
                this.jsPsych.finishTrial(trialData);
            };
            const initialise_button_events = () => {
                const buttons = document.querySelectorAll('.jspsych-audio-html-response-button-wrapper button');
                buttons.forEach((button) => {
                    button.addEventListener('click', handle_button_response);
                });
                if ((trial.audio_stimulus !== null && trial.audio_stimulus_play_button !== null) ||
                    (trial.audio_choices !== null && trial.audio_choice_play_button !== null)) {
                    const audioButtons = document.querySelectorAll('.jspsych-audio-html-play-button');
                    audioButtons.forEach((audioButton) => {
                        audioButton.addEventListener('click', handle_play_button);
                    });
                }
            };
            if (trial.audio_stimulus !== null) {
                this.stimulusBuffers = yield create_buffer_list(trial.audio_stimulus);
            }
            if (trial.audio_choices !== null) {
                this.choiceBuffers = yield create_buffer_lists(trial.audio_choices);
            }
            // play audio
            startTime = performance.now();
            if (trial.audio_stimulus !== null && trial.audio_stimulus_autoplay) {
                if (trial.audioend_ends_trial) {
                    play_buffer_list(this.stimulusBuffers, trial.audio_stimulus_break_duration, end_trial, trial.audio_stimulus_start_delay);
                }
                else if (trial.trial_duration !== null) {
                    play_buffer_list(this.stimulusBuffers, trial.audio_stimulus_break_duration, () => {
                        enable_buttons_after_audio();
                        const diff = trial.trial_duration - totalTime;
                        this.jsPsych.pluginAPI.setTimeout(() => {
                            end_trial();
                        }, diff);
                    }, trial.audio_stimulus_start_delay);
                }
                else {
                    play_buffer_list(this.stimulusBuffers, trial.audio_stimulus_break_duration, () => { enable_buttons_after_audio(); }, trial.audio_stimulus_start_delay);
                }
            }
            // display html prompt and buttons
            display_element.innerHTML = main_html();
            // initialise buttons (if enable_buttons_after_audio is not set)
            if (enableButtonsAfterAudio < 0) {
                initialise_button_events();
            }
            else {
                // otherwise, we disable the buttons
                disable_all_buttons();
            }
            // run the on_load function
            on_load();
        });
    }
}
AudioHtmlButtonResponse.info = info;

module.exports = AudioHtmlButtonResponse;
//# sourceMappingURL=index.cjs.map
