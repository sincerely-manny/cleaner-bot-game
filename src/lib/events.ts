type Message =
    | {
          type: string;
          payload: string;
      }
    | {
          type: 'log';
          payload: {
              level: 'log' | 'error' | 'warn' | 'info';
              message: string;
          };
      };

export const reactNativeEvents = {
    listen: (callback?: (msg: Message) => void) => {
        window.addEventListener('message', function (event) {
            try {
                const message = JSON.parse(
                    (event as MessageEvent<string>).data
                ) as Message;
                callback && callback(message);
            } catch (error) {}
        });
    },
    send: ({ type, payload }: Message) => {
        const message = {
            type,
            payload,
        };
        window.ReactNativeWebView?.postMessage(JSON.stringify(message));
    },
    redirectLogs: () => {
        if (!window.ReactNativeWebView) {
            return;
        }
        (
            ['log', 'error', 'warn', 'info'] as Extract<
                'log' | 'error' | 'warn' | 'info',
                keyof typeof console
            >[]
        ).forEach(function (level) {
            const original = console[level];
            console[level] = function () {
                original.apply(console, Array.from(arguments));
                reactNativeEvents.send({
                    type: 'log',
                    payload: {
                        level,
                        message: Array.from(arguments).join(' '),
                    },
                });
            };
        });
    },
};
