import { Plugin, Editor, MarkdownView, Notice, Menu } from 'obsidian';
import { DeepSeekAPI } from './src/deepseek-api';
import { DeepSeekSettingTab, DeepSeekSettings, DEFAULT_SETTINGS } from './src/settings';

export default class DeepSeekTextOptimizerPlugin extends Plugin {
	settings: DeepSeekSettings;
	private deepSeekAPI: DeepSeekAPI | null = null;
	private statusBarItem: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();

		// 加载样式文件
		this.addStyles();

		// 初始化 API
		if (this.settings.apiKey) {
			this.deepSeekAPI = new DeepSeekAPI(this.settings.apiKey, this.settings.model);
		}

		// 添加状态栏
		this.addStatusBar();

		// 添加工具栏按钮
		this.addRibbonIcon('sparkles', 'DeepSeek 文本优化器', async (evt: MouseEvent) => {
			await this.showRibbonMenu(evt);
		});

		// 注册命令：优化文本
		this.addCommand({
			id: 'optimize-text',
			name: '优化文本',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.optimizeText(editor);
			}
		});

		// 注册命令：思维启发
		this.addCommand({
			id: 'generate-insights',
			name: '思维启发',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.generateInsights(editor);
			}
		});

		// 注册命令：AI 观点咨询
		this.addCommand({
			id: 'provide-opinion',
			name: 'AI 观点咨询',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.provideOpinion(editor);
			}
		});

		// 注册命令：组合功能 - 优化 + 思维启发
		this.addCommand({
			id: 'optimize-and-insights',
			name: '优化文本 + 思维启发',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.optimizeAndInsights(editor);
			}
		});

		// 注册命令：组合功能 - 优化 + 观点咨询
		this.addCommand({
			id: 'optimize-and-opinion',
			name: '优化文本 + AI 观点咨询',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.optimizeAndOpinion(editor);
			}
		});

		// 注册命令：全部功能
		this.addCommand({
			id: 'all-features',
			name: '全部功能（优化 + 思维启发 + 观点咨询）',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.allFeatures(editor);
			}
		});

		// 添加设置标签页
		this.addSettingTab(new DeepSeekSettingTab(this.app, this));
	}

	onunload() {
		this.deepSeekAPI = null;
		if (this.statusBarItem) {
			this.statusBarItem.remove();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.updateStatusBar();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// 重新初始化 API
		if (this.settings.apiKey) {
			this.deepSeekAPI = new DeepSeekAPI(this.settings.apiKey, this.settings.model);
		} else {
			this.deepSeekAPI = null;
		}
		this.updateStatusBar();
	}

	private addStyles() {
		// 加载 CSS 文件 - Obsidian 会自动加载 styles.css，这里可以添加额外的内联样式
		// 如果需要动态样式，可以使用 this.addStyleSheet()
	}

	private addStatusBar() {
		this.statusBarItem = this.addStatusBarItem();
		this.statusBarItem.addClass('plugin-deepseek-text-optimizer');
		this.updateStatusBar();
	}

	private updateStatusBar() {
		if (!this.statusBarItem) return;
		
		if (this.settings.apiKey && this.deepSeekAPI) {
			this.statusBarItem.setText('✨ DeepSeek 已就绪');
			this.statusBarItem.setAttr('aria-label', 'DeepSeek API 已配置，点击查看菜单');
			this.statusBarItem.onclick = null;
		} else {
			this.statusBarItem.setText('⚠️ DeepSeek 未配置');
			this.statusBarItem.setAttr('aria-label', '点击打开设置配置 DeepSeek API Key');
			this.statusBarItem.onclick = () => {
				(this.app as any).setting.open();
				(this.app as any).setting.openTabById('deepseek-text-optimizer');
			};
		}
	}

	private setStatusBarLoading(text: string) {
		if (!this.statusBarItem) return;
		this.statusBarItem.setText(`⏳ ${text}`);
		this.statusBarItem.addClass('is-loading');
	}

	private clearStatusBarLoading() {
		if (!this.statusBarItem) return;
		this.statusBarItem.removeClass('is-loading');
		this.updateStatusBar();
	}

	private async showRibbonMenu(evt: MouseEvent) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		
		if (!activeView) {
			new Notice('请先打开一个 Markdown 文件');
			return;
		}

		const menu = new Menu();
		
		menu.addItem((item) => {
			item.setTitle('✨ 优化文本');
			item.setIcon('sparkles');
			item.onClick(async () => {
				await this.optimizeText(activeView.editor);
			});
		});

		menu.addItem((item) => {
			item.setTitle('💡 思维启发');
			item.setIcon('lightbulb');
			item.onClick(async () => {
				await this.generateInsights(activeView.editor);
			});
		});

		menu.addItem((item) => {
			item.setTitle('💬 AI 观点咨询');
			item.setIcon('message-square');
			item.onClick(async () => {
				await this.provideOpinion(activeView.editor);
			});
		});

		menu.addSeparator();

		menu.addItem((item) => {
			item.setTitle('✨💡 优化 + 思维启发');
			item.setIcon('sparkles');
			item.onClick(async () => {
				await this.optimizeAndInsights(activeView.editor);
			});
		});

		menu.addItem((item) => {
			item.setTitle('✨💬 优化 + 观点咨询');
			item.setIcon('sparkles');
			item.onClick(async () => {
				await this.optimizeAndOpinion(activeView.editor);
			});
		});

		menu.addItem((item) => {
			item.setTitle('🚀 全部功能');
			item.setIcon('rocket');
			item.onClick(async () => {
				await this.allFeatures(activeView.editor);
			});
		});

		menu.addSeparator();

		menu.addItem((item) => {
			item.setTitle('⚙️ 打开设置');
			item.setIcon('settings');
			item.onClick(() => {
				(this.app as any).setting.open();
				(this.app as any).setting.openTabById('deepseek-text-optimizer');
			});
		});

		menu.showAtPosition({ x: evt.clientX, y: evt.clientY });
	}

	private getActiveEditor(): Editor | null {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		return activeView ? activeView.editor : null;
	}

	private getSelectedText(editor: Editor): string {
		const selection = editor.getSelection();
		if (selection) {
			return selection;
		}
		// 如果没有选中文本，获取整个文档
		return editor.getValue();
	}

	private async checkAPI(): Promise<boolean> {
		if (!this.deepSeekAPI) {
			new Notice('请先在设置中配置 DeepSeek API Key');
			// 自动打开设置
			setTimeout(() => {
				(this.app as any).setting.open();
				(this.app as any).setting.openTabById('deepseek-text-optimizer');
			}, 500);
			return false;
		}
		return true;
	}

	private async optimizeText(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要优化的文本，或确保文档中有内容');
			return;
		}

		new Notice('正在优化文本...');
		this.setStatusBarLoading('优化中...');
		
		try {
			const optimized = await this.deepSeekAPI!.optimizeText(text);
			this.clearStatusBarLoading();
			
			if (this.settings.autoReplace) {
				const selection = editor.getSelection();
				if (selection) {
					editor.replaceSelection(optimized);
				} else {
					editor.setValue(optimized);
				}
				new Notice('✅ 文本已优化并替换');
			} else {
				// 在文档末尾添加优化后的文本
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## 优化后的文本\n\n${optimized}\n\n---\n`);
				new Notice('✅ 优化后的文本已添加到文档末尾');
			}
		} catch (error) {
			this.clearStatusBarLoading();
			new Notice(`❌ 优化失败: ${error instanceof Error ? error.message : '未知错误'}`);
			console.error('DeepSeek 优化错误:', error);
		}
	}

	private async generateInsights(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要分析的文本，或确保文档中有内容');
			return;
		}

		new Notice('正在生成思维启发...');
		this.setStatusBarLoading('生成中...');
		
		try {
			const insights = await this.deepSeekAPI!.generateInsights(text);
			this.clearStatusBarLoading();
			
			const endPos = editor.getCursor('to');
			editor.setCursor(endPos.line + 1, 0);
			editor.replaceSelection(`\n\n## 思维启发\n\n${insights}\n\n---\n`);
			new Notice('✅ 思维启发已添加到文档');
		} catch (error) {
			this.clearStatusBarLoading();
			new Notice(`❌ 生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
			console.error('DeepSeek 思维启发错误:', error);
		}
	}

	private async provideOpinion(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要咨询的文本，或确保文档中有内容');
			return;
		}

		new Notice('正在生成 AI 观点...');
		this.setStatusBarLoading('生成中...');
		
		try {
			const opinion = await this.deepSeekAPI!.provideOpinion(text);
			this.clearStatusBarLoading();
			
			const endPos = editor.getCursor('to');
			editor.setCursor(endPos.line + 1, 0);
			editor.replaceSelection(`\n\n## AI 观点咨询\n\n${opinion}\n\n---\n`);
			new Notice('✅ AI 观点已添加到文档');
		} catch (error) {
			this.clearStatusBarLoading();
			new Notice(`❌ 生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
			console.error('DeepSeek 观点咨询错误:', error);
		}
	}

	private async optimizeAndInsights(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要处理的文本，或确保文档中有内容');
			return;
		}

		new Notice('正在优化文本并生成思维启发...');
		this.setStatusBarLoading('处理中...');
		
		try {
			const [optimized, insights] = await Promise.all([
				this.deepSeekAPI!.optimizeText(text),
				this.deepSeekAPI!.generateInsights(text)
			]);
			this.clearStatusBarLoading();
			
			if (this.settings.autoReplace) {
				const selection = editor.getSelection();
				if (selection) {
					editor.replaceSelection(optimized);
				} else {
					editor.setValue(optimized);
				}
				// 只添加思维启发，不重复添加优化后的文本
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## 思维启发\n\n${insights}\n\n---\n`);
			} else {
				// 添加所有内容
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## 优化后的文本\n\n${optimized}\n\n## 思维启发\n\n${insights}\n\n---\n`);
			}
			new Notice('✅ 处理完成');
		} catch (error) {
			this.clearStatusBarLoading();
			new Notice(`❌ 处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
			console.error('DeepSeek 组合功能错误:', error);
		}
	}

	private async optimizeAndOpinion(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要处理的文本，或确保文档中有内容');
			return;
		}

		new Notice('正在优化文本并生成 AI 观点...');
		this.setStatusBarLoading('处理中...');
		
		try {
			const [optimized, opinion] = await Promise.all([
				this.deepSeekAPI!.optimizeText(text),
				this.deepSeekAPI!.provideOpinion(text)
			]);
			this.clearStatusBarLoading();
			
			if (this.settings.autoReplace) {
				const selection = editor.getSelection();
				if (selection) {
					editor.replaceSelection(optimized);
				} else {
					editor.setValue(optimized);
				}
				// 只添加 AI 观点，不重复添加优化后的文本
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## AI 观点咨询\n\n${opinion}\n\n---\n`);
			} else {
				// 添加所有内容
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## 优化后的文本\n\n${optimized}\n\n## AI 观点咨询\n\n${opinion}\n\n---\n`);
			}
			new Notice('✅ 处理完成');
		} catch (error) {
			this.clearStatusBarLoading();
			new Notice(`❌ 处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
			console.error('DeepSeek 组合功能错误:', error);
		}
	}

	private async allFeatures(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要处理的文本，或确保文档中有内容');
			return;
		}

		new Notice('正在执行全部功能...');
		this.setStatusBarLoading('处理中...');
		
		try {
			const [optimized, insights, opinion] = await Promise.all([
				this.deepSeekAPI!.optimizeText(text),
				this.deepSeekAPI!.generateInsights(text),
				this.deepSeekAPI!.provideOpinion(text)
			]);
			this.clearStatusBarLoading();
			
			if (this.settings.autoReplace) {
				const selection = editor.getSelection();
				if (selection) {
					editor.replaceSelection(optimized);
				} else {
					editor.setValue(optimized);
				}
				// 只添加思维启发和观点，不重复添加优化后的文本
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## 思维启发\n\n${insights}\n\n## AI 观点咨询\n\n${opinion}\n\n---\n`);
			} else {
				// 添加所有内容
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## 优化后的文本\n\n${optimized}\n\n## 思维启发\n\n${insights}\n\n## AI 观点咨询\n\n${opinion}\n\n---\n`);
			}
			new Notice('✅ 全部功能处理完成');
		} catch (error) {
			this.clearStatusBarLoading();
			new Notice(`❌ 处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
			console.error('DeepSeek 全部功能错误:', error);
		}
	}
}

