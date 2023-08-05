import { App, Editor, Plugin, PluginSettingTab, Setting } from "obsidian";

// Remember to rename these classes and interfaces!

interface ObsidianEquationsSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianEquationsSettings = {
	mySetting: "test",
};

export default class ObsidianEquations extends Plugin {
	settings: ObsidianEquationsSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click test", evt);
		// });

		// register new event handler for when user types in editor
		this.registerEvent(
			this.app.workspace.on("editor-change", (editor: Editor) => {
				// get the current line
				const line = editor.getLine(editor.getCursor().line);
				// check if the line starts with a double dollar sign
				if (line.startsWith("$$")) {
					console.log(line);
				}
			})
		);
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
