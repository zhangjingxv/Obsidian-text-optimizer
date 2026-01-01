import { Plugin, Editor, MarkdownView, Notice } from 'obsidian';
import { DeepSeekAPI } from './src/deepseek-api';
import { DeepSeekSettingTab, DeepSeekSettings, DEFAULT_SETTINGS } from './src/settings';

export default class DeepSeekTextOptimizerPlugin extends Plugin {
	settings: DeepSeekSettings;
	private deepSeekAPI: DeepSeekAPI | null = null;

	async onload() {
		await this.loadSettings();

		// 初始化 API
		if (this.settings.apiKey) {
			this.deepSeekAPI = new DeepSeekAPI(this.settings.apiKey, this.settings.model);
		}

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

		// 监听设置变化
		this.registerEvent(
			this.app.workspace.on('settings-tab-opened', () => {
				if (this.settings.apiKey && !this.deepSeekAPI) {
					this.deepSeekAPI = new DeepSeekAPI(this.settings.apiKey, this.settings.model);
				}
			})
		);
	}

	onunload() {
		this.deepSeekAPI = null;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// 重新初始化 API
		if (this.settings.apiKey) {
			this.deepSeekAPI = new DeepSeekAPI(this.settings.apiKey, this.settings.model);
		} else {
			this.deepSeekAPI = null;
		}
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
			return false;
		}
		return true;
	}

	private async optimizeText(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要优化的文本');
			return;
		}

		new Notice('正在优化文本...');
		
		try {
			const optimized = await this.deepSeekAPI!.optimizeText(text);
			
			if (this.settings.autoReplace) {
				const selection = editor.getSelection();
				if (selection) {
					editor.replaceSelection(optimized);
				} else {
					editor.setValue(optimized);
				}
				new Notice('文本已优化并替换');
			} else {
				// 在文档末尾添加优化后的文本
				const endPos = editor.getCursor('to');
				editor.setCursor(endPos.line + 1, 0);
				editor.replaceSelection(`\n\n## 优化后的文本\n\n${optimized}\n\n---\n`);
				new Notice('优化后的文本已添加到文档末尾');
			}
		} catch (error) {
			new Notice(`优化失败: ${error instanceof Error ? error.message : '未知错误'}`);
		}
	}

	private async generateInsights(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要分析的文本');
			return;
		}

		new Notice('正在生成思维启发...');
		
		try {
			const insights = await this.deepSeekAPI!.generateInsights(text);
			
			const endPos = editor.getCursor('to');
			editor.setCursor(endPos.line + 1, 0);
			editor.replaceSelection(`\n\n## 思维启发\n\n${insights}\n\n---\n`);
			new Notice('思维启发已添加到文档');
		} catch (error) {
			new Notice(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
		}
	}

	private async provideOpinion(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要咨询的文本');
			return;
		}

		new Notice('正在生成 AI 观点...');
		
		try {
			const opinion = await this.deepSeekAPI!.provideOpinion(text);
			
			const endPos = editor.getCursor('to');
			editor.setCursor(endPos.line + 1, 0);
			editor.replaceSelection(`\n\n## AI 观点咨询\n\n${opinion}\n\n---\n`);
			new Notice('AI 观点已添加到文档');
		} catch (error) {
			new Notice(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
		}
	}

	private async optimizeAndInsights(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要处理的文本');
			return;
		}

		new Notice('正在优化文本并生成思维启发...');
		
		try {
			const [optimized, insights] = await Promise.all([
				this.deepSeekAPI!.optimizeText(text),
				this.deepSeekAPI!.generateInsights(text)
			]);
			
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
			new Notice('处理完成');
		} catch (error) {
			new Notice(`处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
		}
	}

	private async optimizeAndOpinion(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要处理的文本');
			return;
		}

		new Notice('正在优化文本并生成 AI 观点...');
		
		try {
			const [optimized, opinion] = await Promise.all([
				this.deepSeekAPI!.optimizeText(text),
				this.deepSeekAPI!.provideOpinion(text)
			]);
			
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
			new Notice('处理完成');
		} catch (error) {
			new Notice(`处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
		}
	}

	private async allFeatures(editor: Editor) {
		if (!await this.checkAPI()) return;

		const text = this.getSelectedText(editor);
		if (!text.trim()) {
			new Notice('请先选中要处理的文本');
			return;
		}

		new Notice('正在执行全部功能...');
		
		try {
			const [optimized, insights, opinion] = await Promise.all([
				this.deepSeekAPI!.optimizeText(text),
				this.deepSeekAPI!.generateInsights(text),
				this.deepSeekAPI!.provideOpinion(text)
			]);
			
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
			new Notice('全部功能处理完成');
		} catch (error) {
			new Notice(`处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
		}
	}
}

