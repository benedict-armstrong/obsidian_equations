import { obsidianEquations } from "emoji";
import { MarkdownRenderChild } from "obsidian";
import { App, Editor, Plugin, PluginSettingTab, Setting } from "obsidian";

// Remember to rename these classes and interfaces!

interface ObsidianEquationsSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianEquationsSettings = {
	mySetting: "test",
};

export class EquationNumber extends MarkdownRenderChild {
	number: number;

	constructor(containerEl: HTMLElement, number: number) {
		super(containerEl);

		this.number = number;
	}

	onload() {
		const numberElement = this.containerEl.createSpan({
			text: `(${this.number})`,
		});
		this.containerEl.appendChild(numberElement);
	}
}

export default class ObsidianEquations extends Plugin {
	settings: ObsidianEquationsSettings;

	async onload() {
		this.registerMarkdownPostProcessor((element, context) => {
			console.log("Running MarkdownPostProcessor", element);
			const equationBlocks = element.getElementsByClassName("math-block");

			for (let index = 0; index < equationBlocks.length; index++) {
				const equationBlock = equationBlocks.item(index);
				console.log("equationBlock", equationBlock);
				if (!equationBlock) {
					continue;
				}
				context.addChild(new EquationNumber(equationBlock, index + 1));
			}
		});

		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: ObsidianEquations;

	constructor(app: App, plugin: ObsidianEquations) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
