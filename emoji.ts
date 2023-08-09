import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginSpec,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";

class EmojiWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");

		div.innerText = "👉";

		return div;
	}
}

class ObsidianEquations implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		// ...
		console.log("ObsidianEquations constructor");
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		// ...
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		for (let { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node: any) {
					if (node.type.name.startsWith("equation")) {
						// add a decoration for the equation
						builder.add(
							node.from,
							node.to,
							Decoration.replace({
								widget: new EmojiWidget(),
							})
						);
					}
				},
			});
		}

		return builder.finish();
	}

	destroy() {
		// ...
	}
}

const pluginSpec: PluginSpec<ObsidianEquations> = {
	decorations: (value: ObsidianEquations) => value.decorations,
};

export const obsidianEquations = ViewPlugin.fromClass(
	ObsidianEquations,
	pluginSpec
);
