import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
declare const info: {
    readonly name: "audio-html-button-response";
    readonly parameters: {
        readonly stimulus: {
            readonly type: ParameterType.STRING;
            readonly default: any;
        };
        readonly choices: {
            readonly type: ParameterType.STRING;
            readonly default: any;
            readonly array: true;
        };
        readonly audio_stimulus: {
            readonly type: ParameterType.AUDIO;
            readonly default: any;
            readonly array: true;
        };
        readonly audio_choices: {
            readonly type: ParameterType.OBJECT;
            readonly default: any;
            readonly array: true;
        };
        readonly audio_stimulus_start_delay: {
            readonly type: ParameterType.INT;
            readonly default: 100;
        };
        readonly audio_stimulus_break_duration: {
            readonly type: ParameterType.INT;
            readonly default: 100;
        };
        readonly audio_choice_break_duration: {
            readonly type: ParameterType.INT;
            readonly default: 100;
        };
        readonly audio_stimulus_autoplay: {
            readonly type: ParameterType.BOOL;
            readonly default: true;
        };
        readonly audio_stimulus_play_button: {
            readonly type: ParameterType.BOOL;
            readonly default: false;
        };
        readonly audio_choice_play_button: {
            readonly type: ParameterType.BOOL;
            readonly default: true;
        };
        readonly button_html: {
            readonly type: ParameterType.HTML_STRING;
            readonly default: "<button class=\"jspsych-btn\">%choice%</button>";
        };
        readonly response_ends_trial: {
            readonly type: ParameterType.BOOL;
            readonly default: true;
        };
        readonly audioend_ends_trial: {
            readonly type: ParameterType.BOOL;
            readonly default: false;
        };
        readonly trial_duration: {
            readonly type: ParameterType.INT;
            readonly default: any;
        };
        readonly before_choices: {
            readonly type: ParameterType.HTML_STRING;
            readonly default: any;
        };
        readonly after_choices: {
            readonly type: ParameterType.HTML_STRING;
            readonly default: any;
        };
        readonly enable_buttons_after_audio: {
            readonly type: ParameterType.INT;
            readonly default: 0;
        };
        readonly correct_choice: {
            readonly type: ParameterType.INT;
            readonly default: any;
        };
        readonly feedback_duration: {
            readonly type: ParameterType.INT;
            readonly default: 500;
        };
    };
};
type Info = typeof info;
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
declare class AudioHtmlButtonResponse implements JsPsychPlugin<Info> {
    private jsPsych;
    static info: {
        readonly name: "audio-html-button-response";
        readonly parameters: {
            readonly stimulus: {
                readonly type: ParameterType.STRING;
                readonly default: any;
            };
            readonly choices: {
                readonly type: ParameterType.STRING;
                readonly default: any;
                readonly array: true;
            };
            readonly audio_stimulus: {
                readonly type: ParameterType.AUDIO;
                readonly default: any;
                readonly array: true;
            };
            readonly audio_choices: {
                readonly type: ParameterType.OBJECT;
                readonly default: any;
                readonly array: true;
            };
            readonly audio_stimulus_start_delay: {
                readonly type: ParameterType.INT;
                readonly default: 100;
            };
            readonly audio_stimulus_break_duration: {
                readonly type: ParameterType.INT;
                readonly default: 100;
            };
            readonly audio_choice_break_duration: {
                readonly type: ParameterType.INT;
                readonly default: 100;
            };
            readonly audio_stimulus_autoplay: {
                readonly type: ParameterType.BOOL;
                readonly default: true;
            };
            readonly audio_stimulus_play_button: {
                readonly type: ParameterType.BOOL;
                readonly default: false;
            };
            readonly audio_choice_play_button: {
                readonly type: ParameterType.BOOL;
                readonly default: true;
            };
            readonly button_html: {
                readonly type: ParameterType.HTML_STRING;
                readonly default: "<button class=\"jspsych-btn\">%choice%</button>";
            };
            readonly response_ends_trial: {
                readonly type: ParameterType.BOOL;
                readonly default: true;
            };
            readonly audioend_ends_trial: {
                readonly type: ParameterType.BOOL;
                readonly default: false;
            };
            readonly trial_duration: {
                readonly type: ParameterType.INT;
                readonly default: any;
            };
            readonly before_choices: {
                readonly type: ParameterType.HTML_STRING;
                readonly default: any;
            };
            readonly after_choices: {
                readonly type: ParameterType.HTML_STRING;
                readonly default: any;
            };
            readonly enable_buttons_after_audio: {
                readonly type: ParameterType.INT;
                readonly default: 0;
            };
            readonly correct_choice: {
                readonly type: ParameterType.INT;
                readonly default: any;
            };
            readonly feedback_duration: {
                readonly type: ParameterType.INT;
                readonly default: 500;
            };
        };
    };
    private stimulusBuffers;
    private choiceBuffers;
    constructor(jsPsych: JsPsych);
    trial(display_element: HTMLElement, trial: TrialType<Info>, on_load: () => void): Promise<void>;
}
export default AudioHtmlButtonResponse;
