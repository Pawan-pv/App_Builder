// c:\my-project\soft-projects\app_builder\v1\src\transformer\publish.transform.ts
import type { Screen, Widget } from "../types";

/**
 * Recursively cleans widgets for the production Flutter manifest.
 * Removes internal editor IDs and helper labels, leaving only 
 * types, props, and children.
 */
function transformWidgetForFlutter(widget: Widget): any {
  const cleanWidget: any = {
    type: widget.type,
    // Ensure props are never undefined; Flutter parser likes empty objects over null
    props: widget.props || {},
  };

  // If the widget is a container (Column/Row), transform its children recursively
  if (widget.children && widget.children.length > 0) {
    cleanWidget.children = widget.children.map((child) => 
      transformWidgetForFlutter(child)
    );
  }

  return cleanWidget;
}

/**
 * Builds the final JSON manifest to be sent to the backend publish service.
 */
export function buildAppVersionJSON(
  screens: Screen[],
  appId: string,
  version: number,
  themeConfig: any = { primaryColor: "#14b8a6", fontFamily: "Poppins" }
) {
  return {
    appId,
    version,
    publishedAt: new Date().toISOString(),
    // Global theme settings for the Flutter MaterialApp
    theme: themeConfig,
    // Map of screens for the Flutter Dynamic Navigator
    screens: screens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      // We wrap the screen's top-level widgets in a root Column for Flutter
      root: {
        type: "Column",
        props: {
          mainAxisAlignment: "start",
          crossAxisAlignment: "stretch",
          padding: 16,
        },
        children: screen.widgets.map((w) => transformWidgetForFlutter(w)),
      },
    })),
    // Optional: Include a reference to the initial screen
    initialRoute: screens[0]?.id || null,
  };
}