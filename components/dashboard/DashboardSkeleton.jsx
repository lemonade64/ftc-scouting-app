import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RootSkeleton() {
  return (
    <div className="container mx-auto p-4 mb-10">
      <Skeleton className="h-9 w-64 mb-6" />
      <div className="flex justify-between mb-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="hover:bg-accent transition-colors">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-[200px] w-full mb-4 rounded-full" />
              <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-4 w-12 mx-auto mb-1" />
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton({ isLoading }) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-y-8">
      {[...Array(2)].map((_, index) => (
        <div key={`dashboard${index}`}>
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-9 w-64" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-[100px] min-[425px]:w-[200px] sm:w-[200px]" />
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="auto">Auto</TabsTrigger>
              <TabsTrigger value="teleop">Teleop</TabsTrigger>
              <TabsTrigger value="endgame">Endgame</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {[...Array(4)].map((_, cardIndex) => (
                  <Card key={`overviewCard${cardIndex}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        <Skeleton className="h-4 w-[100px]" />
                      </CardTitle>
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-[60px]" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-6 w-[200px]" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-6 w-[200px]" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="auto">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, cardIndex) => (
                  <Card key={`autoCard${cardIndex}`}>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-[150px]" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="teleop">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, cardIndex) => (
                  <Card key={`teleopCard${cardIndex}`}>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-[150px]" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="endgame">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, cardIndex) => (
                  <Card key={`endgameCard${cardIndex}`}>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-[150px]" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </div>
  );
}
