import { PluginSettingTab, Setting, App } from 'obsidian';
import DeepSeekTextOptimizerPlugin from '../main';

export interface DeepSeekSettings {
	apiKey: string;
	model: string;
	autoReplace: boolean;
}

export const DEFAULT_SETTINGS: DeepSeekSettings = {
	apiKey: '',
	model: 'deepseek-chat',
	autoReplace: false,
};

export class DeepSeekSettingTab extends PluginSettingTab {
	plugin: DeepSeekTextOptimizerPlugin;

	constructor(app: App, plugin: DeepSeekTextOptimizerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'DeepSeek 文本优化器设置' });

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('请输入你的 DeepSeek API Key')
			.addText(text => text
				.setPlaceholder('sk-...')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('模型')
			.setDesc('选择使用的 DeepSeek 模型')
			.addDropdown(dropdown => dropdown
				.addOption('deepseek-chat', 'deepseek-chat')
				.addOption('deepseek-coder', 'deepseek-coder')
				.setValue(this.plugin.settings.model)
				.onChange(async (value) => {
					this.plugin.settings.model = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('自动替换原文')
			.setDesc('优化后是否自动替换选中的文本（关闭则创建新版本）')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoReplace)
				.onChange(async (value) => {
					this.plugin.settings.autoReplace = value;
					await this.plugin.saveSettings();
				}));
	}
}

