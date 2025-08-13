document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 辅助函数 ---
    const animateOnScroll = (selector, vars) => {
        gsap.utils.toArray(selector).forEach(item => {
            gsap.from(item, {
                ...vars,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    };

    // 模拟真实按钮点击效果
    const simulateButtonClick = (button, duration = 150) => {
        return new Promise(resolve => {
            // 按下效果
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                ease: 'power2.out',
                onComplete: () => {
                    // 释放效果
                    gsap.to(button, {
                        scale: 1,
                        duration: 0.1,
                        ease: 'back.out(1.7)',
                        onComplete: () => {
                            setTimeout(resolve, duration - 200);
                        }
                    });
                }
            });

            // 添加点击时的光晕效果
            button.style.boxShadow = '0 0 20px rgba(255, 209, 0, 0.4)';
            setTimeout(() => {
                button.style.boxShadow = '';
            }, 200);
        });
    };

    // 模拟消息选择的点击效果
    const simulateMessageClick = (message) => {
        return new Promise(resolve => {
            // 添加点击波纹效果
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            message.appendChild(ripple);

            gsap.fromTo(ripple,
                { scale: 0, opacity: 0.6 },
                { scale: 4, opacity: 0, duration: 0.6, ease: 'power2.out',
                  onComplete: () => {
                      ripple.remove();
                      resolve();
                  }
                }
            );

            // 消息选中动画
            gsap.to(message, {
                scale: 0.98,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        });
    };

    // --- 基础章节动画 ---
    gsap.from("#landing .landing-title span", { opacity: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.15 });
    animateOnScroll('#journey-start .p-large', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out', stagger: 0.2 });
    animateOnScroll('#concept .concept-title', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
    animateOnScroll('#concept .concept-visual', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power3.out', delay: 0.2 });

    // --- 多渠道捕获动画 ---
    animateOnScroll('#capture .capture-header', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
    animateOnScroll('#capture .channel-nav', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.2 });
    animateOnScroll('#capture .channel-showcase', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out', delay: 0.4 });

    // --- 核心系统动画 ---
    animateOnScroll('#core-system .system-header', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' });
    animateOnScroll('#core-system .system-main', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out', delay: 0.2 });

    // --- 终章动画 ---
    animateOnScroll('#invitation .p-large', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out', stagger: 0.2 });
    animateOnScroll('#invitation .cta-container', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.5 });

    // --- 多渠道捕获交互 & 演示管理系统 ---
    const channelBtns = document.querySelectorAll('.channel-btn');
    const channelPanels = document.querySelectorAll('.channel-panel');

    // 演示管理器
    class DemoManager {
        constructor() {
            this.currentDemo = null;
            this.demoTimeouts = new Map();
            this.isInCaptureSection = false;
            this.hasInitialized = false;
        }

        // 停止当前演示
        stopCurrentDemo() {
            if (this.currentDemo) {
                // 清除所有相关的定时器
                this.demoTimeouts.forEach(timeout => clearTimeout(timeout));
                this.demoTimeouts.clear();

                // 重置演示状态
                this.resetDemoState(this.currentDemo);
                this.currentDemo = null;
            }
        }

        // 重置演示状态
        resetDemoState(demoType) {
            switch(demoType) {
                case 'im':
                    this.resetIMDemo();
                    break;
                case 'docs':
                    this.resetDocsDemo();
                    break;
                case 'ones':
                    this.resetOnesDemo();
                    break;
                case 'meeting':
                    this.resetMeetingDemo();
                    break;
                case 'voice':
                    this.resetVoiceDemo();
                    break;
            }
        }

        // 重置即时通讯演示
        resetIMDemo() {
            const desktopContent = document.getElementById('desktop-content');
            if (desktopContent) {
                // 隐藏所有演示界面
                const overlays = ['selection-overlay', 'ai-processing', 'todo-result'];
                overlays.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.style.display = 'none';
                });

                // 清除消息选择状态
                const selectableMessages = desktopContent.querySelectorAll('.im-message.selectable');
                selectableMessages.forEach(msg => msg.classList.remove('selected'));

                // 移除成功通知
                const successNotification = desktopContent.querySelector('.success-notification');
                if (successNotification) successNotification.remove();
            }
        }

        // 重置文档演示
        resetDocsDemo() {
            const docsInterface = document.getElementById('demo-docs');
            if (docsInterface) {
                // 隐藏所有演示界面
                const overlays = ['custom-context-menu', 'docs-ai-processing', 'docs-todo-result'];
                overlays.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.style.display = 'none';
                });

                // 清除文本选择
                const selection = window.getSelection();
                if (selection) selection.removeAllRanges();

                // 重置任务项样式
                const firstTask = docsInterface.querySelector('[data-task="task1"] .task-text');
                if (firstTask) {
                    gsap.set(firstTask, {
                        backgroundColor: 'transparent',
                        scale: 1,
                        boxShadow: 'none'
                    });
                }

                // 移除成功通知
                const successNotification = docsInterface.querySelector('.docs-success-notification');
                if (successNotification) successNotification.remove();
            }
        }

        // 重置Ones演示
        resetOnesDemo() {
            const onesInterface = document.getElementById('demo-ones');
            if (onesInterface) {
                // 隐藏所有演示界面
                const overlays = ['ones-ai-processing', 'ones-sync-result'];
                overlays.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.style.display = 'none';
                });

                // 清除任务选择状态
                const taskItems = onesInterface.querySelectorAll('.ones-task-item');
                taskItems.forEach(item => item.classList.remove('selected'));

                // 移除成功通知
                const successNotification = onesInterface.querySelector('.ones-success-notification');
                if (successNotification) successNotification.remove();
            }
        }

        // 重置会议演示
        resetMeetingDemo() {
            const meetingInterface = document.getElementById('demo-meeting');
            if (meetingInterface) {
                // 隐藏所有演示界面
                const overlays = ['meeting-ai-processing', 'meeting-result'];
                overlays.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.style.display = 'none';
                });

                // 清除高亮文本状态
                const highlightTexts = meetingInterface.querySelectorAll('.highlight-text');
                highlightTexts.forEach(text => text.classList.remove('selected'));

                // 移除成功通知
                const successNotification = meetingInterface.querySelector('.meeting-success-notification');
                if (successNotification) successNotification.remove();
            }
        }

        // 重置语音演示
        resetVoiceDemo() {
            const voiceInterface = document.getElementById('demo-voice');
            if (voiceInterface) {
                // 隐藏所有演示界面
                const overlays = ['voice-transcript', 'voice-ai-processing', 'voice-result'];
                overlays.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.style.display = 'none';
                });

                // 重置录音按钮状态
                const recordBtn = document.getElementById('voice-record');
                if (recordBtn) {
                    recordBtn.querySelector('.btn-text').textContent = '开始录音';
                    recordBtn.classList.remove('recording');
                }

                // 重置波形动画
                const waveBars = voiceInterface.querySelectorAll('.wave-bar');
                waveBars.forEach(bar => {
                    bar.style.animationPlayState = 'paused';
                });

                // 移除成功通知
                const successNotification = voiceInterface.querySelector('.voice-success-notification');
                if (successNotification) successNotification.remove();
            }
        }

        // 启动指定演示
        startDemo(demoType) {
            this.stopCurrentDemo();
            this.currentDemo = demoType;

            switch(demoType) {
                case 'im':
                    this.startIMDemo();
                    break;
                case 'docs':
                    this.startDocsDemo();
                    break;
                case 'ones':
                    this.startOnesDemo();
                    break;
                case 'meeting':
                    this.startMeetingDemo();
                    break;
                case 'voice':
                    this.startVoiceDemo();
                    break;
            }
        }

        // 启动即时通讯演示
        startIMDemo() {
            const timeout = setTimeout(() => {
                if (this.currentDemo === 'im') {
                    // 直接调用即时通讯演示
                    const desktopContent = document.getElementById('desktop-content');
                    if (desktopContent) {
                        this.runIMDemo();
                    }
                }
            }, 1000);
            this.demoTimeouts.set('im-start', timeout);
        }

        // 启动文档演示
        startDocsDemo() {
            const timeout = setTimeout(() => {
                if (this.currentDemo === 'docs') {
                    // 直接调用文档演示
                    const docsInterface = document.getElementById('demo-docs');
                    if (docsInterface) {
                        this.runDocsDemo();
                    }
                }
            }, 1000);
            this.demoTimeouts.set('docs-start', timeout);
        }

        // 启动Ones演示
        startOnesDemo() {
            const timeout = setTimeout(() => {
                if (this.currentDemo === 'ones') {
                    const onesInterface = document.getElementById('demo-ones');
                    if (onesInterface) {
                        this.runOnesDemo();
                    }
                }
            }, 1000);
            this.demoTimeouts.set('ones-start', timeout);
        }

        // 启动会议演示
        startMeetingDemo() {
            const timeout = setTimeout(() => {
                if (this.currentDemo === 'meeting') {
                    const meetingInterface = document.getElementById('demo-meeting');
                    if (meetingInterface) {
                        this.runMeetingDemo();
                    }
                }
            }, 1000);
            this.demoTimeouts.set('meeting-start', timeout);
        }

        // 启动语音演示
        startVoiceDemo() {
            const timeout = setTimeout(() => {
                if (this.currentDemo === 'voice') {
                    const voiceInterface = document.getElementById('demo-voice');
                    if (voiceInterface) {
                        this.runVoiceDemo();
                    }
                }
            }, 1000);
            this.demoTimeouts.set('voice-start', timeout);
        }

        // 运行即时通讯演示
        async runIMDemo() {
            // 等待1秒后开始演示
            await new Promise(resolve => setTimeout(resolve, 1000));

            const desktopContent = document.getElementById('desktop-content');
            const selectableMessages = desktopContent.querySelectorAll('.im-message.selectable');
            const selectionOverlay = document.getElementById('selection-overlay');
            const countElement = document.getElementById('count');
            const createTodoBtn = document.getElementById('create-todo');
            const confirmBtn = document.getElementById('confirm-todo');
            let selectedMessages = new Set();

            function updateSelectionUI() {
                const count = selectedMessages.size;
                countElement.textContent = count;

                if (count > 0) {
                    selectionOverlay.style.display = 'flex';
                    gsap.fromTo(selectionOverlay,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
                    );
                } else {
                    gsap.to(selectionOverlay, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        onComplete: () => {
                            selectionOverlay.style.display = 'none';
                        }
                    });
                }
            }

            // 步骤1: 逐个选择消息，添加真实点击效果
            const messagesToSelect = ['msg1', 'msg2'];
            for (let i = 0; i < messagesToSelect.length; i++) {
                const msgId = messagesToSelect[i];
                const message = document.querySelector(`[data-id="${msgId}"]`);

                // 模拟点击效果
                await simulateMessageClick(message);

                // 添加选中状态
                selectedMessages.add(msgId);
                message.classList.add('selected');
                updateSelectionUI();

                await new Promise(resolve => setTimeout(resolve, 600));
            }

            // 步骤2: 等待1秒后模拟点击生成待办按钮
            await new Promise(resolve => setTimeout(resolve, 1000));
            await simulateButtonClick(createTodoBtn);

                        // 触发AI处理流程
            this.triggerIMAddTodo();
        }

        // 触发即时通讯加入待办流程
        async triggerIMAddTodo() {
            const desktopContent = document.getElementById('desktop-content');
            const selectionOverlay = document.getElementById('selection-overlay');

            // 隐藏选择界面
            selectionOverlay.style.display = 'none';

            // 显示AI处理界面
            const aiProcessing = document.getElementById('ai-processing');
            aiProcessing.style.display = 'flex';

            gsap.fromTo(aiProcessing,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );

            // 进度条动画
            const progressFill = aiProcessing.querySelector('.progress-fill');
            gsap.fromTo(progressFill,
                { width: '0%' },
                { width: '100%', duration: 2.5, ease: 'power2.inOut' }
            );

            // 等待处理完成
            await new Promise(resolve => setTimeout(resolve, 2500));

            // 隐藏AI处理，显示结果
            gsap.to(aiProcessing, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    aiProcessing.style.display = 'none';

                    // 显示待办结果
                    const todoResult = document.getElementById('todo-result');
                    todoResult.style.display = 'block';

                    gsap.fromTo(todoResult,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                    );

                    // 待办项逐个显示
                    const todoItems = todoResult.querySelectorAll('.todo-item');
                    gsap.fromTo(todoItems,
                        { opacity: 0, x: -20 },
                        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
                    );

                    // 自动演示：逐个勾选待办事项
                    setTimeout(async () => {
                        const todoChecks = todoResult.querySelectorAll('.todo-check');
                        for (let i = 0; i < todoChecks.length; i++) {
                            await new Promise(resolve => setTimeout(resolve, 800));
                            todoChecks[i].classList.add('checked');
                        }

                        // 所有待办勾选完成后，等待0.5秒自动确认添加
                        setTimeout(async () => {
                            const confirmBtn = document.getElementById('confirm-todo');
                            await simulateButtonClick(confirmBtn);
                            this.triggerIMConfirm();
                        }, 500);
                    }, 600);
                }
            });
        }

        // 触发即时通讯确认添加
        triggerIMConfirm() {
            const desktopContent = document.getElementById('desktop-content');
            const todoResult = document.getElementById('todo-result');

            gsap.to(todoResult, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                onComplete: () => {
                    todoResult.style.display = 'none';

                    // 显示成功消息
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-notification';
                    successMsg.innerHTML = `
                        <img src="icons/IMG_9438.webp" class="success-icon" alt="成功">
                        <div class="success-text">待办事项已成功添加到您的任务列表</div>
                    `;
                    desktopContent.appendChild(successMsg);

                    gsap.fromTo(successMsg,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );

                    // 3秒后自动隐藏成功消息，然后重新开始演示
                    setTimeout(() => {
                        gsap.to(successMsg, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                successMsg.remove();
                                // 等待2秒后重新开始演示循环（如果仍在当前演示中）
                                const timeout = setTimeout(() => {
                                    if (this.currentDemo === 'im') {
                                        this.runIMDemo();
                                    }
                                }, 2000);
                                this.demoTimeouts.set('im-loop', timeout);
                            }
                        });
                    }, 3000);
                }
            });
        }

        // 运行文档演示
        async runDocsDemo() {
            // 等待1秒后开始演示
            await new Promise(resolve => setTimeout(resolve, 1000));

            const docsInterface = document.getElementById('demo-docs');
            const contextMenu = document.getElementById('custom-context-menu');

            // 自动选择第一个@李四的任务文本
            const firstTask = docsInterface.querySelector('[data-task="task1"] .task-text');
            if (firstTask) {
                // 创建文本选择 - 选择整个任务文本
                const range = document.createRange();
                const selection = window.getSelection();

                // 选择整个任务文本内容
                range.selectNodeContents(firstTask);
                selection.removeAllRanges();
                selection.addRange(range);

                // 添加选择高亮效果和动画
                gsap.fromTo(firstTask,
                    { backgroundColor: 'transparent', scale: 1 },
                    { backgroundColor: 'rgba(59, 115, 230, 0.1)', scale: 1.02, duration: 0.3, ease: 'power2.out' }
                );

                // 添加脉冲效果提示用户注意
                gsap.to(firstTask, {
                    boxShadow: '0 0 0 3px rgba(59, 115, 230, 0.3)',
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });

                // 等待1秒后自动显示右键菜单
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 模拟右键点击 - 获取相对于文档容器的位置
                const docsRect = docsInterface.getBoundingClientRect();
                const taskRect = firstTask.getBoundingClientRect();

                contextMenu.style.display = 'block';
                contextMenu.style.left = (taskRect.left - docsRect.left + 150) + 'px';
                contextMenu.style.top = (taskRect.top - docsRect.top + 80) + 'px';

                gsap.fromTo(contextMenu,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
                );

                // 高亮"加入待办"选项
                const addTodoOption = document.getElementById('context-add-todo');
                gsap.to(addTodoOption, {
                    backgroundColor: '#EBF8FF',
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });

                // 等待1.5秒后自动点击"加入待办"
                await new Promise(resolve => setTimeout(resolve, 1500));

                // 添加点击动画效果
                gsap.to(addTodoOption, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        // 触发加入待办流程
                        this.triggerDocsAddTodo();
                    }
                });
            }
        }

        // 触发文档加入待办流程
        async triggerDocsAddTodo() {
            const docsInterface = document.getElementById('demo-docs');
            const contextMenu = document.getElementById('custom-context-menu');

            // 隐藏右键菜单
            contextMenu.style.display = 'none';

            // 显示AI处理界面
            const docsAiProcessing = document.getElementById('docs-ai-processing');
            docsAiProcessing.style.display = 'flex';

            gsap.fromTo(docsAiProcessing,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );

            // 进度条动画
            const docsProgressFill = docsAiProcessing.querySelector('.docs-progress-fill');
            gsap.fromTo(docsProgressFill,
                { width: '0%' },
                { width: '100%', duration: 2.5, ease: 'power2.inOut' }
            );

            // 等待处理完成
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 隐藏AI处理，显示结果
            gsap.to(docsAiProcessing, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    docsAiProcessing.style.display = 'none';

                    // 显示待办结果
                    const docsTodoResult = document.getElementById('docs-todo-result');
                    docsTodoResult.style.display = 'block';

                    gsap.fromTo(docsTodoResult,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                    );

                    // 待办项逐个显示
                    const docsTodoItems = docsTodoResult.querySelectorAll('.docs-todo-item');
                    gsap.fromTo(docsTodoItems,
                        { opacity: 0, x: -20 },
                        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
                    );

                    // 自动演示：逐个勾选待办事项
                    setTimeout(async () => {
                        const docsTodoChecks = docsTodoResult.querySelectorAll('.docs-todo-check');
                        for (let i = 0; i < docsTodoChecks.length; i++) {
                            await new Promise(resolve => setTimeout(resolve, 800));
                            docsTodoChecks[i].classList.add('checked');
                        }

                        // 所有待办勾选完成后，等待0.5秒自动确认添加
                        setTimeout(async () => {
                            const docsConfirmBtn = document.getElementById('docs-confirm-todo');
                            await simulateButtonClick(docsConfirmBtn);
                            this.triggerDocsConfirm();
                        }, 500);
                    }, 600);
                }
            });
        }

        // 触发文档确认添加
        triggerDocsConfirm() {
            const docsInterface = document.getElementById('demo-docs');
            const docsTodoResult = document.getElementById('docs-todo-result');

            gsap.to(docsTodoResult, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                onComplete: () => {
                    docsTodoResult.style.display = 'none';

                    // 显示成功消息
                    const successMsg = document.createElement('div');
                    successMsg.className = 'docs-success-notification';
                    successMsg.innerHTML = `
                        <img src="icons/IMG_9438.webp" class="success-icon" alt="成功">
                        <div class="success-text">任务已成功添加到您的待办清单</div>
                    `;
                    docsInterface.appendChild(successMsg);

                    gsap.fromTo(successMsg,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );

                    // 3秒后自动隐藏成功消息，然后重新开始演示
                    setTimeout(() => {
                        gsap.to(successMsg, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                successMsg.remove();
                                // 清除文本选择
                                const selection = window.getSelection();
                                if (selection) selection.removeAllRanges();

                                // 重置任务项样式
                                const firstTask = docsInterface.querySelector('[data-task="task1"] .task-text');
                                if (firstTask) {
                                    gsap.to(firstTask, {
                                        backgroundColor: 'transparent',
                                        scale: 1,
                                        boxShadow: 'none',
                                        duration: 0.3
                                    });
                                }
                                // 等待2秒后重新开始演示循环（如果仍在当前演示中）
                                const timeout = setTimeout(() => {
                                    if (this.currentDemo === 'docs') {
                                        this.runDocsDemo();
                                    }
                                }, 2000);
                                this.demoTimeouts.set('docs-loop', timeout);
                            }
                        });
                    }, 3000);
                }
            });
        }

        // 运行Ones演示
        async runOnesDemo() {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const onesInterface = document.getElementById('demo-ones');
            const taskItems = onesInterface.querySelectorAll('.ones-task-item');

            // 步骤1: 逐个高亮任务项
            for (let i = 0; i < taskItems.length; i++) {
                const item = taskItems[i];
                gsap.to(item, {
                    backgroundColor: 'rgba(255, 209, 0, 0.05)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // 步骤2: 等待1秒后触发同步
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.triggerOnesSync();
        }

        // 触发Ones同步流程
        async triggerOnesSync() {
            const onesInterface = document.getElementById('demo-ones');
            const aiProcessing = document.getElementById('ones-ai-processing');

            aiProcessing.style.display = 'flex';
            gsap.fromTo(aiProcessing,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );

            const progressFill = aiProcessing.querySelector('.ones-progress-fill');
            gsap.fromTo(progressFill,
                { width: '0%' },
                { width: '100%', duration: 2.5, ease: 'power2.inOut' }
            );

            await new Promise(resolve => setTimeout(resolve, 2500));

            gsap.to(aiProcessing, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    aiProcessing.style.display = 'none';
                    const syncResult = document.getElementById('ones-sync-result');
                    syncResult.style.display = 'block';

                    gsap.fromTo(syncResult,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                    );

                    setTimeout(async () => {
                        const confirmBtn = document.getElementById('ones-confirm');
                        await simulateButtonClick(confirmBtn);
                        this.triggerOnesConfirm();
                    }, 2000);
                }
            });
        }

        // 触发Ones确认
        triggerOnesConfirm() {
            const onesInterface = document.getElementById('demo-ones');
            const syncResult = document.getElementById('ones-sync-result');

            gsap.to(syncResult, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                onComplete: () => {
                    syncResult.style.display = 'none';
                    const successMsg = document.createElement('div');
                    successMsg.className = 'ones-success-notification';
                    successMsg.innerHTML = `
                        <div class="success-icon"></div>
                        <div class="success-text">任务状态已成功同步</div>
                    `;
                    onesInterface.appendChild(successMsg);

                    gsap.fromTo(successMsg,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );

                    setTimeout(() => {
                        gsap.to(successMsg, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                successMsg.remove();
                                const timeout = setTimeout(() => {
                                    if (this.currentDemo === 'ones') {
                                        this.runOnesDemo();
                                    }
                                }, 2000);
                                this.demoTimeouts.set('ones-loop', timeout);
                            }
                        });
                    }, 3000);
                }
            });
        }

        // 运行会议演示
        async runMeetingDemo() {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const meetingInterface = document.getElementById('demo-meeting');
            const highlightTexts = meetingInterface.querySelectorAll('.highlight-text');

            // 步骤1: 逐个高亮行动项
            for (let i = 0; i < highlightTexts.length; i++) {
                const text = highlightTexts[i];
                gsap.to(text, {
                    backgroundColor: 'rgba(255, 209, 0, 0.2)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // 步骤2: 等待1秒后触发AI分析
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.triggerMeetingAnalysis();
        }

        // 触发会议分析流程
        async triggerMeetingAnalysis() {
            const meetingInterface = document.getElementById('demo-meeting');
            const aiProcessing = document.getElementById('meeting-ai-processing');

            aiProcessing.style.display = 'flex';
            gsap.fromTo(aiProcessing,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );

            const progressFill = aiProcessing.querySelector('.meeting-progress-fill');
            gsap.fromTo(progressFill,
                { width: '0%' },
                { width: '100%', duration: 2.5, ease: 'power2.inOut' }
            );

            await new Promise(resolve => setTimeout(resolve, 2500));

            gsap.to(aiProcessing, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    aiProcessing.style.display = 'none';
                    const result = document.getElementById('meeting-result');
                    result.style.display = 'block';

                    gsap.fromTo(result,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                    );

                    const actionItems = result.querySelectorAll('.meeting-action-item');
                    gsap.fromTo(actionItems,
                        { opacity: 0, x: -20 },
                        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
                    );

                    setTimeout(async () => {
                        const actionChecks = result.querySelectorAll('.action-check');
                        for (let i = 0; i < actionChecks.length; i++) {
                            await new Promise(resolve => setTimeout(resolve, 800));
                            actionChecks[i].classList.add('checked');
                        }

                        setTimeout(async () => {
                            const confirmBtn = document.getElementById('meeting-confirm');
                            await simulateButtonClick(confirmBtn);
                            this.triggerMeetingConfirm();
                        }, 500);
                    }, 600);
                }
            });
        }

        // 触发会议确认
        triggerMeetingConfirm() {
            const meetingInterface = document.getElementById('demo-meeting');
            const result = document.getElementById('meeting-result');

            gsap.to(result, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                onComplete: () => {
                    result.style.display = 'none';
                    const successMsg = document.createElement('div');
                    successMsg.className = 'meeting-success-notification';
                    successMsg.innerHTML = `
                        <div class="success-icon"></div>
                        <div class="success-text">行动项已成功添加到待办清单</div>
                    `;
                    meetingInterface.appendChild(successMsg);

                    gsap.fromTo(successMsg,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );

                    setTimeout(() => {
                        gsap.to(successMsg, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                successMsg.remove();
                                const highlightTexts = meetingInterface.querySelectorAll('.highlight-text');
                                highlightTexts.forEach(text => {
                                    gsap.to(text, {
                                        backgroundColor: 'rgba(255, 209, 0, 0.1)',
                                        duration: 0.3
                                    });
                                });
                                const timeout = setTimeout(() => {
                                    if (this.currentDemo === 'meeting') {
                                        this.runMeetingDemo();
                                    }
                                }, 2000);
                                this.demoTimeouts.set('meeting-loop', timeout);
                            }
                        });
                    }, 3000);
                }
            });
        }

        // 运行语音演示
        async runVoiceDemo() {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const voiceInterface = document.getElementById('demo-voice');
            const recordBtn = document.getElementById('voice-record');
            const waveBars = voiceInterface.querySelectorAll('.wave-bar');

            // 步骤1: 模拟点击录音按钮
            await simulateButtonClick(recordBtn);
            recordBtn.querySelector('.btn-text').textContent = '录音中...';
            recordBtn.classList.add('recording');

            // 激活波形动画
            waveBars.forEach(bar => {
                bar.style.animationPlayState = 'running';
            });

            // 步骤2: 录音3秒后显示转录结果
            await new Promise(resolve => setTimeout(resolve, 3000));

            recordBtn.querySelector('.btn-text').textContent = '开始录音';
            recordBtn.classList.remove('recording');
            waveBars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });

            const transcript = document.getElementById('voice-transcript');
            transcript.style.display = 'block';
            gsap.fromTo(transcript,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );

            // 步骤3: 等待2秒后触发AI处理
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.triggerVoiceProcessing();
        }

        // 触发语音处理流程
        async triggerVoiceProcessing() {
            const voiceInterface = document.getElementById('demo-voice');
            const transcript = document.getElementById('voice-transcript');
            const aiProcessing = document.getElementById('voice-ai-processing');

            transcript.style.display = 'none';
            aiProcessing.style.display = 'flex';

            gsap.fromTo(aiProcessing,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );

            const progressFill = aiProcessing.querySelector('.voice-progress-fill');
            gsap.fromTo(progressFill,
                { width: '0%' },
                { width: '100%', duration: 2.5, ease: 'power2.inOut' }
            );

            await new Promise(resolve => setTimeout(resolve, 2500));

            gsap.to(aiProcessing, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                    aiProcessing.style.display = 'none';
                    const result = document.getElementById('voice-result');
                    result.style.display = 'block';

                    gsap.fromTo(result,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                    );

                    const taskItems = result.querySelectorAll('.voice-task-item');
                    gsap.fromTo(taskItems,
                        { opacity: 0, x: -20 },
                        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.3 }
                    );

                    setTimeout(async () => {
                        const taskChecks = result.querySelectorAll('.task-check');
                        for (let i = 0; i < taskChecks.length; i++) {
                            await new Promise(resolve => setTimeout(resolve, 800));
                            taskChecks[i].classList.add('checked');
                        }

                        setTimeout(async () => {
                            const confirmBtn = document.getElementById('voice-confirm');
                            await simulateButtonClick(confirmBtn);
                            this.triggerVoiceConfirm();
                        }, 500);
                    }, 600);
                }
            });
        }

        // 触发语音确认
        triggerVoiceConfirm() {
            const voiceInterface = document.getElementById('demo-voice');
            const result = document.getElementById('voice-result');

            gsap.to(result, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                onComplete: () => {
                    result.style.display = 'none';
                    const successMsg = document.createElement('div');
                    successMsg.className = 'voice-success-notification';
                    successMsg.innerHTML = `
                        <div class="success-icon"></div>
                        <div class="success-text">语音任务已成功添加到待办清单</div>
                    `;
                    voiceInterface.appendChild(successMsg);

                    gsap.fromTo(successMsg,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );

                    setTimeout(() => {
                        gsap.to(successMsg, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                successMsg.remove();
                                const timeout = setTimeout(() => {
                                    if (this.currentDemo === 'voice') {
                                        this.runVoiceDemo();
                                    }
                                }, 2000);
                                this.demoTimeouts.set('voice-loop', timeout);
                            }
                        });
                    }, 3000);
                }
            });
        }
    }

    const demoManager = new DemoManager();

    // 滚动监听 - 检测是否进入捕获区域
    ScrollTrigger.create({
        trigger: '#capture',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
            demoManager.isInCaptureSection = true;
            // 如果还没有初始化，启动默认的即时通讯演示
            if (!demoManager.hasInitialized) {
                demoManager.hasInitialized = true;
                // 等待组件加载完成后启动
                setTimeout(() => {
                    if (demoManager.isInCaptureSection) {
                        demoManager.startDemo('im');
                    }
                }, 500);
            }
        },
        onLeave: () => {
            demoManager.isInCaptureSection = false;
            demoManager.stopCurrentDemo();
        },
        onEnterBack: () => {
            demoManager.isInCaptureSection = true;
            // 重新进入时启动当前激活渠道的演示
            const activeBtn = document.querySelector('.channel-btn.active');
            if (activeBtn) {
                const targetId = activeBtn.dataset.target;
                const demoType = targetId === 'channel-im' ? 'im' :
                                targetId === 'channel-docs' ? 'docs' :
                                targetId === 'channel-ones' ? 'ones' :
                                targetId === 'channel-meeting' ? 'meeting' :
                                targetId === 'channel-voice' ? 'voice' : null;
                if (demoType) {
                    setTimeout(() => {
                        if (demoManager.isInCaptureSection) {
                            demoManager.startDemo(demoType);
                        }
                    }, 500);
                }
            }
        },
        onLeaveBack: () => {
            demoManager.isInCaptureSection = false;
            demoManager.stopCurrentDemo();
        }
    });

    channelBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            if (btn.classList.contains('active')) return;

            // 按钮点击反馈
            await simulateButtonClick(btn);

            // 停止当前演示
            demoManager.stopCurrentDemo();

            // 更新按钮状态
            channelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 切换面板 - 优化版
            const targetId = btn.dataset.target;
            const currentPanel = document.querySelector('.channel-panel.active');
            const targetPanel = document.getElementById(targetId);

            if (currentPanel && currentPanel !== targetPanel) {
                // 淡出当前面板
                gsap.to(currentPanel, {
                    opacity: 0,
                    duration: 0.2,
                    ease: 'power2.out',
                    onComplete: () => {
                        currentPanel.classList.remove('active');
                        currentPanel.style.display = 'none';

                        // 淡入目标面板
                        targetPanel.style.display = 'block';
                        targetPanel.classList.add('active');
                        gsap.fromTo(targetPanel,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.3, ease: 'power2.out',
                              onComplete: () => {
                                  // 面板切换完成后启动对应演示
                                  if (demoManager.isInCaptureSection) {
                                      const demoType = targetId === 'channel-im' ? 'im' :
                                                      targetId === 'channel-docs' ? 'docs' :
                                                      targetId === 'channel-ones' ? 'ones' :
                                                      targetId === 'channel-meeting' ? 'meeting' :
                                                      targetId === 'channel-voice' ? 'voice' : null;
                                      if (demoType) {
                                          demoManager.startDemo(demoType);
                                      }
                                  }
                              }
                            }
                        );
                    }
                });
            } else if (!currentPanel) {
                // 首次显示
                targetPanel.style.display = 'block';
                targetPanel.classList.add('active');
                gsap.fromTo(targetPanel,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: 'power2.out',
                      onComplete: () => {
                          // 面板显示完成后启动对应演示
                          if (demoManager.isInCaptureSection) {
                              const demoType = targetId === 'channel-im' ? 'im' :
                                              targetId === 'channel-docs' ? 'docs' :
                                              targetId === 'channel-ones' ? 'ones' :
                                              targetId === 'channel-meeting' ? 'meeting' :
                                              targetId === 'channel-voice' ? 'voice' : null;
                              if (demoType) {
                                  demoManager.startDemo(demoType);
                              }
                          }
                      }
                    }
                );
            }
        });

        // 按钮悬停效果增强
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });

    // --- 任务捕获交互 (保持原有的即时通讯演示) ---
    const desktopContent = document.getElementById('desktop-content');
    if (desktopContent) {
        const chatSceneHTML = `
            <div class="im-message selectable" data-id="msg1">
                <div class="message-select-area">
                    <div class="select-checkbox"></div>
                </div>
                <div class="im-avatar manager"></div>
                <div class="im-content">
                    <div class="message-header">
                        <span class="author">项目经理</span>
                        <span class="timestamp">14:25</span>
                    </div>
                    <div class="message-bubble">@李四 下午3点开会讨论Q3方案</div>
                </div>
            </div>
            <div class="im-message selectable" data-id="msg2">
                <div class="message-select-area">
                    <div class="select-checkbox"></div>
                </div>
                <div class="im-avatar manager"></div>
                <div class="im-content">
                    <div class="message-header">
                        <span class="author">项目经理</span>
                        <span class="timestamp">14:26</span>
                    </div>
                    <div class="message-bubble">@李四 会前准备用户调研结论</div>
                </div>
            </div>
            <div class="im-message">
                <div class="im-avatar user"></div>
                <div class="im-content">
                    <div class="message-header">
                        <span class="author">李四</span>
                        <span class="timestamp">14:27</span>
                    </div>
                    <div class="message-bubble user-msg">收到</div>
                </div>
            </div>
            <div class="selection-overlay" id="selection-overlay" style="display: none;">
                <div class="selection-info">
                    <span class="selected-count">已选择 <span id="count">0</span> 条消息</span>
                </div>
                <div class="selection-actions">
                    <button class="action-btn cancel" id="cancel-selection">取消</button>
                    <button class="action-btn primary" id="create-todo">生成待办</button>
                </div>
            </div>
            <div class="ai-processing" id="ai-processing" style="display: none;">
                <div class="processing-content">
                    <img src="icons/IMG_9438.webp" class="ai-icon" alt="AI伙伴">
                    <div class="processing-text">
                        <div class="processing-title">AI正在分析消息内容...</div>
                        <div class="processing-progress">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="todo-result" id="todo-result" style="display: none;">
                <div class="result-header">
                    <img src="icons/IMG_9438.webp" class="result-icon" alt="AI伙伴">
                    <div class="result-title">生成的待办事项</div>
                </div>
                <div class="todo-items">
                    <div class="todo-item">
                        <div class="todo-check"></div>
                        <div class="todo-text">
                            <div class="todo-title">参加Q3方案讨论会议</div>
                            <div class="todo-detail">时间：今天下午3点 | 优先级：高</div>
                        </div>
                    </div>
                    <div class="todo-item">
                        <div class="todo-check"></div>
                        <div class="todo-text">
                            <div class="todo-title">准备用户调研结论</div>
                            <div class="todo-detail">负责人：李四 | 截止：会议前</div>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="result-btn secondary">编辑</button>
                    <button class="result-btn primary" id="confirm-todo">确认添加</button>
                </div>
            </div>
            <div class="success-feedback" id="success-feedback" style="display: none;">
                <div class="success-content">
                    <img src="icons/IMG_9439.webp" class="success-icon" alt="成功">
                    <div class="success-text">
                        <div class="success-title">任务已成功添加到您的待办清单</div>
                        <div class="success-subtitle">您的AI伙伴将持续关注这些任务的进展</div>
                    </div>
                </div>
            </div>
        `;

        desktopContent.innerHTML = chatSceneHTML;

        // 获取元素
        let selectedMessages = new Set();
        const selectableMessages = document.querySelectorAll('.im-message.selectable');
        const selectionOverlay = document.getElementById('selection-overlay');
        const countElement = document.getElementById('count');
        const createTodoBtn = document.getElementById('create-todo');
        const cancelBtn = document.getElementById('cancel-selection');
        const confirmBtn = document.getElementById('confirm-todo');

        function updateSelectionUI() {
            const count = selectedMessages.size;
            countElement.textContent = count;

            if (count > 0) {
                selectionOverlay.style.display = 'flex';
                gsap.fromTo(selectionOverlay,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
                );
            } else {
                gsap.to(selectionOverlay, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    onComplete: () => {
                        selectionOverlay.style.display = 'none';
                    }
                });
            }
        }

        // 自动连播演示函数
        async function startAutoDemo() {
            // 等待1秒后开始演示
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 步骤1: 逐个选择消息，添加真实点击效果
            const messagesToSelect = ['msg1', 'msg2'];
            for (let i = 0; i < messagesToSelect.length; i++) {
                const msgId = messagesToSelect[i];
                const message = document.querySelector(`[data-id="${msgId}"]`);

                // 模拟点击效果
                await simulateMessageClick(message);

                // 添加选中状态
                selectedMessages.add(msgId);
                message.classList.add('selected');
                updateSelectionUI();

                await new Promise(resolve => setTimeout(resolve, 600));
            }

            // 步骤2: 等待1秒后模拟点击生成待办按钮
            await new Promise(resolve => setTimeout(resolve, 1000));
            await simulateButtonClick(createTodoBtn);
            createTodoBtn.click();
        }

        // 生成待办流程 - 手动操作时使用
        createTodoBtn.addEventListener('click', async () => {
            // 如果是演示管理器控制的演示，不执行手动操作
            if (demoManager.currentDemo === 'im') return;

            if (selectedMessages.size === 0) return;

            // 调用演示管理器的方法
            demoManager.triggerIMAddTodo();
        });

        // 确认添加待办
        confirmBtn.addEventListener('click', () => {
            // 如果是演示管理器控制的演示，由演示管理器处理
            if (demoManager.currentDemo === 'im') return;

            const todoResult = document.getElementById('todo-result');

            gsap.to(todoResult, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                onComplete: () => {
                    todoResult.style.display = 'none';

                    // 显示成功消息
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-notification';
                    successMsg.innerHTML = `
                        <img src="icons/IMG_9438.webp" class="success-icon" alt="成功">
                        <div class="success-text">待办事项已成功添加到您的任务列表</div>
                    `;
                    desktopContent.appendChild(successMsg);

                    gsap.fromTo(successMsg,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );

                    // 3秒后自动隐藏成功消息，然后重新开始演示
                    setTimeout(() => {
                        gsap.to(successMsg, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                successMsg.remove();
                                // 等待2秒后重新开始演示循环（如果仍在当前演示中）
                                const timeout = setTimeout(() => {
                                    if (demoManager.currentDemo === 'im') {
                                        demoManager.runIMDemo();
                                    }
                                }, 2000);
                                demoManager.demoTimeouts.set('im-loop', timeout);
                            }
                        });
                    }, 3000);
                }
            });
        });

        // 手动消息选择（保留交互性）
        selectableMessages.forEach(message => {
            message.addEventListener('click', (e) => {
                e.preventDefault();
                const messageId = message.dataset.id;

                if (selectedMessages.has(messageId)) {
                    selectedMessages.delete(messageId);
                    message.classList.remove('selected');
                } else {
                    selectedMessages.add(messageId);
                    message.classList.add('selected');
                }

                updateSelectionUI();
            });
        });

        // 取消选择
        cancelBtn.addEventListener('click', () => {
            selectedMessages.clear();
            selectableMessages.forEach(msg => msg.classList.remove('selected'));
            updateSelectionUI();
        });

        // 移除自动启动，由演示管理器控制
        // startAutoDemo();
    }

    // --- 占位符悬停效果 ---
    const placeholders = document.querySelectorAll('.demo-placeholder');
    placeholders.forEach(placeholder => {
        placeholder.addEventListener('mouseenter', () => {
            gsap.to(placeholder, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        placeholder.addEventListener('mouseleave', () => {
            gsap.to(placeholder, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // --- 学城文档交互 ---
    const docsInterface = document.getElementById('demo-docs');
    if (docsInterface) {
        let selectedText = '';
        let currentSelection = null;
        const contextMenu = document.getElementById('custom-context-menu');
        const docsConfirmBtn = document.getElementById('docs-confirm-todo');

        // 禁用默认右键菜单
        docsInterface.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            const selection = window.getSelection();
            if (selection.toString().trim()) {
                selectedText = selection.toString().trim();
                currentSelection = selection;

                // 计算相对于文档容器的位置
                const docsRect = docsInterface.getBoundingClientRect();
                const menuX = e.clientX - docsRect.left;
                const menuY = e.clientY - docsRect.top;

                // 显示自定义右键菜单
                contextMenu.style.display = 'block';
                contextMenu.style.left = menuX + 'px';
                contextMenu.style.top = menuY + 'px';

                gsap.fromTo(contextMenu,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)' }
                );
            }
        });

        // 点击其他地方隐藏菜单
        document.addEventListener('click', (e) => {
            if (!contextMenu.contains(e.target)) {
                gsap.to(contextMenu, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.2,
                    onComplete: () => {
                        contextMenu.style.display = 'none';
                    }
                });
            }
        });

        // 复制功能
        document.getElementById('context-copy').addEventListener('click', () => {
            if (selectedText) {
                navigator.clipboard.writeText(selectedText).then(() => {
                    // 简单的复制反馈
                    const copyBtn = document.getElementById('context-copy');
                    const originalText = copyBtn.querySelector('.menu-text').textContent;
                    copyBtn.querySelector('.menu-text').textContent = '已复制';
                    setTimeout(() => {
                        copyBtn.querySelector('.menu-text').textContent = originalText;
                    }, 1000);
                });
            }
            contextMenu.style.display = 'none';
        });

        // 加入待办功能 - 手动操作时使用
        document.getElementById('context-add-todo').addEventListener('click', async () => {
            if (!selectedText) return;

            // 如果是演示管理器控制的演示，不执行手动操作
            if (demoManager.currentDemo === 'docs') return;

            contextMenu.style.display = 'none';

            // 调用演示管理器的方法
            demoManager.triggerDocsAddTodo();
        });

        // 确认添加待办
        docsConfirmBtn.addEventListener('click', () => {
            // 如果是演示管理器控制的演示，由演示管理器处理
            if (demoManager.currentDemo === 'docs') return;

            const docsTodoResult = document.getElementById('docs-todo-result');

            gsap.to(docsTodoResult, {
                opacity: 0,
                y: -30,
                duration: 0.4,
                onComplete: () => {
                    docsTodoResult.style.display = 'none';

                    // 显示成功消息
                    const successMsg = document.createElement('div');
                    successMsg.className = 'docs-success-notification';
                    successMsg.innerHTML = `
                        <img src="icons/IMG_9438.webp" class="success-icon" alt="成功">
                        <div class="success-text">任务已成功添加到您的待办清单</div>
                    `;
                    docsInterface.appendChild(successMsg);

                    gsap.fromTo(successMsg,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5 }
                    );

                    // 3秒后自动隐藏成功消息，然后重新开始演示
                    setTimeout(() => {
                        gsap.to(successMsg, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                successMsg.remove();
                                // 清除文本选择
                                if (currentSelection) {
                                    currentSelection.removeAllRanges();
                                }
                                // 重置任务项样式
                                const firstTask = docsInterface.querySelector('[data-task="task1"] .task-text');
                                if (firstTask) {
                                    gsap.to(firstTask, {
                                        backgroundColor: 'transparent',
                                        scale: 1,
                                        boxShadow: 'none',
                                        duration: 0.3
                                    });
                                }
                                // 手动操作完成，不需要重新启动演示
                            }
                        });
                    }, 3000);
                }
            });
        });

        // 自动演示函数
        async function startDocsAutoDemo() {
            // 等待2秒后开始演示
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 自动选择第一个@李四的任务文本
            const firstTask = docsInterface.querySelector('[data-task="task1"] .task-text');
            if (firstTask) {
                // 创建文本选择 - 选择整个任务文本
                const range = document.createRange();
                const selection = window.getSelection();

                // 选择整个任务文本内容
                range.selectNodeContents(firstTask);
                selection.removeAllRanges();
                selection.addRange(range);

                selectedText = selection.toString().trim();
                currentSelection = selection;

                // 添加选择高亮效果和动画
                gsap.fromTo(firstTask,
                    { backgroundColor: 'transparent', scale: 1 },
                    { backgroundColor: 'rgba(59, 115, 230, 0.1)', scale: 1.02, duration: 0.3, ease: 'power2.out' }
                );

                // 添加脉冲效果提示用户注意
                gsap.to(firstTask, {
                    boxShadow: '0 0 0 3px rgba(59, 115, 230, 0.3)',
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });

                // 等待1.5秒后自动显示右键菜单
                await new Promise(resolve => setTimeout(resolve, 1500));

                // 模拟右键点击 - 获取相对于文档容器的位置
                const docsRect = docsInterface.getBoundingClientRect();
                const taskRect = firstTask.getBoundingClientRect();

                contextMenu.style.display = 'block';
                contextMenu.style.left = (taskRect.left - docsRect.left + 150) + 'px';
                contextMenu.style.top = (taskRect.top - docsRect.top + 80) + 'px';

                gsap.fromTo(contextMenu,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
                );

                // 高亮"加入待办"选项
                const addTodoOption = document.getElementById('context-add-todo');
                gsap.to(addTodoOption, {
                    backgroundColor: '#EBF8FF',
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });

                // 等待2秒后自动点击"加入待办"
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 添加点击动画效果
                gsap.to(addTodoOption, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        addTodoOption.click();
                    }
                });
            }
        }

        // 移除自动启动，由演示管理器控制
        // startDocsAutoDemo();
    }

    // --- 核心系统导航切换功能 ---
    function initCoreSystemNavigation() {
        console.log('🔧 初始化核心系统导航...');

        const systemNavBtns = document.querySelectorAll('.system-nav .nav-btn');
        const systemPanels = document.querySelectorAll('.system-panel');

        console.log('📊 找到导航按钮:', systemNavBtns.length);
        console.log('📊 找到面板:', systemPanels.length);

        if (systemNavBtns.length === 0 || systemPanels.length === 0) {
            console.log('⏳ 元素未找到，100ms后重试...');
            setTimeout(initCoreSystemNavigation, 100);
            return;
        }

        console.log('✅ 开始绑定事件...');
        systemNavBtns.forEach((btn, index) => {
            console.log(`🔗 绑定按钮 ${index}:`, btn.textContent, '目标:', btn.dataset.target);

            btn.addEventListener('click', function(e) {
                console.log('🖱️ 按钮被点击:', this.textContent);
                e.preventDefault();
                e.stopPropagation();

                const targetId = this.dataset.target;
                const targetPanel = document.getElementById(targetId);

                console.log('🎯 目标面板ID:', targetId);
                console.log('🎯 找到目标面板:', !!targetPanel);

                if (!targetPanel) {
                    console.error('❌ 未找到目标面板:', targetId);
                    return;
                }

                // 更新按钮状态
                systemNavBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                console.log('✅ 按钮状态已更新');

                // 隐藏所有面板
                systemPanels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.style.display = 'none';
                });
                console.log('✅ 所有面板已隐藏');

                // 显示目标面板
                targetPanel.style.display = 'block';
                targetPanel.classList.add('active');
                console.log('✅ 目标面板已显示');

                // 添加动画效果
                gsap.fromTo(targetPanel,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            console.log('🎬 面板切换动画完成');
                        }
                    }
                );
            });

            // 悬停效果
            btn.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    gsap.to(this, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
                }
            });

            btn.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    gsap.to(this, { scale: 1, duration: 0.3, ease: 'power2.out' });
                }
            });
        });

        console.log('🎉 核心系统导航初始化完成!');
    }

    // 初始化核心系统导航
    initCoreSystemNavigation();

    // 情感共生 - 光环交互
    const haloMascot = document.getElementById('halo-mascot');
    const emotionControls = document.querySelectorAll('.emotion-controls .control-btn');
    if (haloMascot && emotionControls.length > 0) {
        emotionControls.forEach(btn => {
            btn.addEventListener('click', () => {
                emotionControls.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const state = btn.dataset.state;
                haloMascot.className = `mascot-image ${state}`;
            });
        });
    }

    // --- 终章增强功能 ---

    // 数字计数动画
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 50; // 控制动画速度
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (stat.dataset.target === '95' ? '%' : '+');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + (stat.dataset.target === '95' ? '%' : '+');
                }
            }, 40);
        });
    }

    // 创建滚动触发的统计数字动画
    const invitationSection = document.getElementById('invitation');
    if (invitationSection) {
        ScrollTrigger.create({
            trigger: invitationSection,
            start: 'top 70%',
            onEnter: animateStats,
            once: true
        });
    }

    // 增强的按钮交互
    const ctaPrimary = document.querySelector('.cta-primary');
    const ctaSecondary = document.querySelector('.cta-secondary');

    if (ctaPrimary) {
        ctaPrimary.addEventListener('mouseenter', () => {
            gsap.to(ctaPrimary, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        ctaPrimary.addEventListener('mouseleave', () => {
            gsap.to(ctaPrimary, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        ctaPrimary.addEventListener('click', () => {
            // 创建点击波纹效果
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 20px; height: 20px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                pointer-events: none;
            `;
            ctaPrimary.appendChild(ripple);

            gsap.fromTo(ripple,
                { scale: 0, opacity: 0.8 },
                { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out',
                  onComplete: () => ripple.remove()
                }
            );

            // 模拟跳转逻辑（实际项目中替换为真实跳转）
            setTimeout(() => {
                alert('感谢您的兴趣！我们将很快为您开启这段旅程。');
            }, 300);
        });
    }

    if (ctaSecondary) {
        ctaSecondary.addEventListener('click', () => {
            // 模拟视频播放（实际项目中替换为真实视频）
            gsap.to(ctaSecondary, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
            });

            setTimeout(() => {
                alert('演示视频功能即将上线，敬请期待！');
            }, 200);
        });
    }

    // 伙伴脉冲增强效果
    const companionShowcase = document.querySelector('.companion-showcase');
    if (companionShowcase) {
        // 鼠标悬停增强脉冲
        companionShowcase.addEventListener('mouseenter', () => {
            const pulse = companionShowcase.querySelector('.companion-pulse');
            if (pulse) {
                gsap.to(pulse, {
                    scale: 1.2,
                    opacity: 0.8,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });

        companionShowcase.addEventListener('mouseleave', () => {
            const pulse = companionShowcase.querySelector('.companion-pulse');
            if (pulse) {
                gsap.to(pulse, {
                    scale: 1,
                    opacity: 0.6,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }

    // 移动端优化 - 触摸反馈
    if ('ontouchstart' in window) {
        const touchElements = [ctaPrimary, ctaSecondary, companionShowcase];

        touchElements.forEach(element => {
            if (element) {
                element.addEventListener('touchstart', (e) => {
                    gsap.to(element, {
                        scale: 0.95,
                        duration: 0.1,
                        ease: 'power2.out'
                    });
                });

                element.addEventListener('touchend', (e) => {
                    gsap.to(element, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'back.out(1.7)'
                    });
                });
            }
        });
    }

    // 视差效果增强
    gsap.utils.toArray('.invitation-question').forEach((question, index) => {
        gsap.fromTo(question,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: question,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
});
