import { FC, createContext, useContext } from "react"; // 18.2.0;
import {
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
} from "react-router-dom"; // 6.15.0

type GetContextType<T> = T extends React.Context<infer U> ? U : never;

interface RouterContext {
  routeContext: GetContextType<typeof UNSAFE_RouteContext>;
  navigationContext: GetContextType<typeof UNSAFE_NavigationContext>;
  locationContext: GetContextType<typeof UNSAFE_LocationContext>;
}

export const RenderInRouterContext: FC<
  RouterContext & {
    children: React.ReactElement;
  }
> = ({ children, routeContext, navigationContext, locationContext }) => {
  return (
    <UNSAFE_RouteContext.Provider value={routeContext}>
      <UNSAFE_NavigationContext.Provider value={navigationContext}>
        <UNSAFE_LocationContext.Provider
          value={locationContext}
          children={children}
        />
      </UNSAFE_NavigationContext.Provider>
    </UNSAFE_RouteContext.Provider>
  );
};

const scopedRouterParentContext = createContext<
  FC<{
    children: any;
  }>
>(() => {
  throw new Error("scopedRouterParentContext not initialized");
});

export const ScopedRouterProvider = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const routeContext = useContext(UNSAFE_RouteContext);
  const navigationContext = useContext(UNSAFE_NavigationContext);
  const locationContext = useContext(UNSAFE_LocationContext);

  const SwitchToRouterParentContext: FC<{
    children: React.ReactElement;
  }> = ({ children }) => (
    <RenderInRouterContext
      routeContext={routeContext}
      navigationContext={navigationContext}
      locationContext={locationContext}
      children={children}
    />
  );
  return (
    <scopedRouterParentContext.Provider value={SwitchToRouterParentContext}>
      <RenderInRouterContext
        routeContext={{
          outlet: null,
          matches: [],
          isDataRoute: false,
        }}
        navigationContext={null as any}
        locationContext={null as any}
        children={children}
      />
    </scopedRouterParentContext.Provider>
  );
};

export const RenderInParentRouterContext: FC<{ children: any }> = ({
  children,
}) => {
  const SwitchToRouterParentContext = useContext(scopedRouterParentContext);
  return <SwitchToRouterParentContext>{children}</SwitchToRouterParentContext>;
};
