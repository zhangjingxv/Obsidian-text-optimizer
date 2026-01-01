import { requestUrl } from 'obsidian';

export interface DeepSeekMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export interface DeepSeekResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
}

export class DeepSeekAPI {
	private apiKey: string;
	private model: string;
	private baseUrl: string = 'https://api.deepseek.com/v1/chat/completions';

	constructor(apiKey: string, model: string = 'deepseek-chat') {
		this.apiKey = apiKey;
		this.model = model;
	}

	async chat(messages: DeepSeekMessage[]): Promise<string> {
		if (!this.apiKey) {
			throw new Error('DeepSeek API Key 未设置');
		}

		try {
			const response = await requestUrl({
				url: this.baseUrl,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					model: this.model,
					messages: messages,
					temperature: 0.7,
					max_tokens: 2000,
				}),
				throw: false, // 不自动抛出错误，让我们手动处理
			});

			// 检查 HTTP 状态码
			if (response.status >= 400) {
				const errorData = response.json as any;
				const errorMessage = errorData?.error?.message || errorData?.message || `HTTP ${response.status}`;
				throw new Error(`API 错误 (${response.status}): ${errorMessage}`);
			}

			const data = response.json as DeepSeekResponse;
			
			if (data.choices && data.choices.length > 0) {
				return data.choices[0].message.content;
			} else {
				throw new Error('API 响应格式错误：未找到 choices 数据');
			}
		} catch (error) {
			if (error instanceof Error) {
				// 如果错误信息已经包含详细信息，直接抛出
				if (error.message.includes('API 错误') || error.message.includes('响应格式错误')) {
					throw error;
				}
				throw new Error(`DeepSeek API 调用失败: ${error.message}`);
			}
			throw new Error('DeepSeek API 调用失败: 未知错误');
		}
	}

	async optimizeText(text: string): Promise<string> {
		const messages: DeepSeekMessage[] = [
			{
				role: 'system',
				content: '你是一个专业的文本优化助手。请优化用户提供的文本，使其表达更加流畅、清晰、易读，同时保持原意不变。直接返回优化后的文本，不要添加任何解释或说明。'
			},
			{
				role: 'user',
				content: `请优化以下文本：\n\n${text}`
			}
		];

		return await this.chat(messages);
	}

	async generateInsights(text: string): Promise<string> {
		const messages: DeepSeekMessage[] = [
			{
				role: 'system',
				content: '你是一个思维启发助手。基于用户提供的文本内容，提供相关的思考启发、延伸建议和拓展方向。用清晰的结构组织你的回答，可以使用列表或分段。'
			},
			{
				role: 'user',
				content: `请为以下文本提供思维启发和延伸建议：\n\n${text}`
			}
		];

		return await this.chat(messages);
	}

	async provideOpinion(text: string): Promise<string> {
		const messages: DeepSeekMessage[] = [
			{
				role: 'system',
				content: '你是一个观点咨询助手。针对用户提供的文本内容，从多个角度提供观点、分析和建议。可以包括：对想法的评价、不同角度的看法、潜在的问题或改进方向等。用清晰的结构组织你的回答。'
			},
			{
				role: 'user',
				content: `请针对以下内容提供观点、分析和建议：\n\n${text}`
			}
		];

		return await this.chat(messages);
	}
}

