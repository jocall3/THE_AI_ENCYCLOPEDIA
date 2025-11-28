import React, { useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';

// IMPORTANT: react-grid-layout requires its own CSS to be imported.
// If you are using a global CSS import, ensure you have:
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';
// in your main app entry point (e.g., App.tsx or index.tsx) or a global stylesheet.
// For this standalone component, we are assuming these styles are globally available.

// --- Dummy Widget Components for Demonstration ---
// These would typically be actual, more complex components imported from other files.

interface ExampleWidgetAProps {
  title?: string;
}
const ExampleWidgetA: React.FC<ExampleWidgetAProps> = ({ title = "Example Widget A" }) => (
  <div className="p-4 bg-blue-100 rounded-lg h-full flex items-center justify-center text-center">
    <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
  </div>
);

interface ExampleWidgetBProps {
  data?: string;
}
const ExampleWidgetB: React.FC<ExampleWidgetBProps> = ({ data = "Some dynamic data" }) => (
  <div className="p-4 bg-green-100 rounded-lg h-full flex items-center justify-center text-center">
    <p className="text-green-800">{data}</p>
  </div>
);

interface ExampleWidgetCProps {
  count?: number;
}
const ExampleWidgetC: React.FC<ExampleWidgetCProps> = ({ count = 0 }) => (
  <div className="p-4 bg-yellow-100 rounded-lg h-full flex items-center justify-center text-center">
    <p className="text-yellow-800 text-xl font-bold">Count: {count}</p>
  </div>
);

// --- Widget Registry Type Definitions ---
export interface WidgetDefinition {
  id: string; // Unique ID for this instance of the widget (must match Layout.i)
  type: string; // Key to look up the actual React component in a registry
  props?: Record<string, any>; // Props specific to this widget instance
}

interface WidgetRegistryItem {
  component: React.FC<any>;
  name: string; // User-friendly name for adding to the dashboard
  initialProps?: Record<string, any>; // Default props when adding a new instance
}

export type WidgetRegistry = {
  [key: string]: WidgetRegistryItem;
};

// --- Widget Registry (Extend this with all your actual components) ---
// This registry maps a string `type` to a React component and its default properties.
const WIDGET_REGISTRY: WidgetRegistry = {
  "widgetA": { component: ExampleWidgetA, name: "Example Widget A" },
  "widgetB": { component: ExampleWidgetB, name: "Example Widget B", initialProps: { data: "Initial B Data" } },
  "widgetC": { component: ExampleWidgetC, name: "Example Widget C", initialProps: { count: 10 } },
};

// --- Widget Wrapper Component ---
// This component provides common styling and the "remove" button for any widget.
interface WidgetWrapperProps {
  id: string;
  title: string; // Title for the wrapper, usually derived from widget name
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ id, title, onRemove, children }) => (
  <div className="relative border border-gray-200 rounded-lg shadow-sm h-full flex flex-col bg-white overflow-hidden">
    <button
      onClick={() => onRemove(id)}
      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center z-10 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      aria-label={`Remove ${title}`}
      title={`Remove ${title}`}
    >
      &times;
    </button>
    <div className="flex-grow p-2 overflow-auto">
      {children}
    </div>
  </div>
);

// --- Main CustomizableWidgetGrid Component ---

interface CustomizableWidgetGridProps {
  initialWidgets?: WidgetDefinition[]; // Initial set of widgets to display
  initialLayout?: Layout[]; // Initial layout for the widgets
  onLayoutChange?: (layout: Layout[]) => void; // Callback for when layout changes (e.g., drag, resize)
  onWidgetsChange?: (widgets: WidgetDefinition[]) => void; // Callback for when widgets are added/removed
  widgetRegistry?: WidgetRegistry; // Optional: Override default widget registry
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomizableWidgetGrid: React.FC<CustomizableWidgetGridProps> = ({
  initialWidgets = [],
  initialLayout = [],
  onLayoutChange,
  onWidgetsChange,
  widgetRegistry = WIDGET_REGISTRY,
}) => {
  const [widgets, setWidgets] = useState<WidgetDefinition[]>(initialWidgets);
  const [layout, setLayout] = useState<Layout[]>(initialLayout);
  
  // Used to generate unique IDs for new widgets
  const [nextWidgetId, setNextWidgetId] = useState(
    initialWidgets.length > 0
      ? Math.max(...initialWidgets.map(w => parseInt(w.id.replace('widget-', '') || '0', 10))) + 1
      : 0
  );

  // Update internal state if initial props change externally
  useEffect(() => {
    setWidgets(initialWidgets);
    setLayout(initialLayout);
    setNextWidgetId(
      initialWidgets.length > 0
        ? Math.max(...initialWidgets.map(w => parseInt(w.id.replace('widget-', '') || '0', 10))) + 1
        : 0
    );
  }, [initialWidgets, initialLayout]);

  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout); // Notify parent component of layout changes
  }, [onLayoutChange]);

  const addWidget = useCallback((widgetType: string) => {
    const registryItem = widgetRegistry[widgetType];
    if (!registryItem) {
      console.warn(`Widget type "${widgetType}" not found in registry.`);
      return;
    }

    const newId = `widget-${nextWidgetId}`;
    setNextWidgetId(prev => prev + 1);

    const newWidget: WidgetDefinition = {
      id: newId,
      type: widgetType,
      props: registryItem.initialProps,
    };

    const updatedWidgets = [...widgets, newWidget];
    setWidgets(updatedWidgets);
    onWidgetsChange?.(updatedWidgets); // Notify parent component of widget list changes

    // Add a default layout item for the new widget.
    // Placing it at y: Infinity makes react-grid-layout find the next available space at the bottom.
    const newLayoutItem: Layout = {
      i: newId,
      x: (layout.length * 2) % 12, // Simple logic to try and place new widgets horizontally
      y: Infinity, // Will place the widget at the bottom of the grid
      w: 4, // Default width
      h: 4, // Default height
      minW: 2,
      minH: 2,
    };

    const updatedLayout = [...layout, newLayoutItem];
    setLayout(updatedLayout);
    onLayoutChange?.(updatedLayout); // Notify parent component of layout changes
  }, [widgets, layout, nextWidgetId, onWidgetsChange, onLayoutChange, widgetRegistry]);

  const removeWidget = useCallback((widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    setWidgets(updatedWidgets);
    onWidgetsChange?.(updatedWidgets); // Notify parent component

    const updatedLayout = layout.filter(item => item.i !== widgetId);
    setLayout(updatedLayout);
    onLayoutChange?.(updatedLayout); // Notify parent component
  }, [widgets, layout, onWidgetsChange, onLayoutChange]);

  const availableWidgetTypes = Object.keys(widgetRegistry);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-4 flex flex-wrap gap-2">
        {availableWidgetTypes.map(type => (
          <button
            key={type}
            onClick={() => addWidget(type)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
          >
            Add {widgetRegistry[type].name}
          </button>
        ))}
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }} // Defines layouts for different breakpoints. 'lg' is the default here.
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60} // Height of one grid row in pixels
        onLayoutChange={handleLayoutChange}
        measureBeforeMount={false} // Can improve initial render performance
        compactType="vertical" // Widgets compact vertically when space is available
        preventCollision={false} // Allows items to temporarily overlap during drag
      >
        {widgets.map(widget => {
          const WidgetComponent = widgetRegistry[widget.type]?.component;
          const widgetName = widgetRegistry[widget.type]?.name || widget.type;

          if (!WidgetComponent) {
            console.warn(`No component found for widget type: ${widget.type}`);
            return (
              <div key={widget.id}>
                <WidgetWrapper id={widget.id} onRemove={removeWidget} title={`Unknown Widget: ${widget.type}`}>
                  <div className="p-4 bg-red-100 text-red-800 rounded-lg h-full flex items-center justify-center">
                    Error: Component not found for {widget.type}
                  </div>
                </WidgetWrapper>
              </div>
            );
          }

          return (
            // The 'key' prop MUST match the 'i' property of the corresponding layout item.
            // react-grid-layout uses this to match children to their layout positions.
            <div key={widget.id}>
              <WidgetWrapper id={widget.id} onRemove={removeWidget} title={widgetName}>
                <WidgetComponent {...widget.props} />
              </WidgetWrapper>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default CustomizableWidgetGrid;