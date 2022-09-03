/**
 * @generated SignedSource<<ab4faddda0ed3ca2405b9357d043ff1a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type HomepageAllPostsQuery$variables = {};
export type HomepageAllPostsQuery$data = {
  readonly allPosts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly body: string;
        readonly comments: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly body: string;
            } | null;
          } | null> | null;
        } | null;
        readonly title: string;
      } | null;
    } | null> | null;
  } | null;
};
export type HomepageAllPostsQuery = {
  response: HomepageAllPostsQuery$data;
  variables: HomepageAllPostsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "HomepageAllPostsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PostConnection",
        "kind": "LinkedField",
        "name": "allPosts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PostEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Post",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommentConnection",
                    "kind": "LinkedField",
                    "name": "comments",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "CommentEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Comment",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "HomepageAllPostsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PostConnection",
        "kind": "LinkedField",
        "name": "allPosts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PostEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Post",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommentConnection",
                    "kind": "LinkedField",
                    "name": "comments",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "CommentEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Comment",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v1/*: any*/),
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d806c0621cdf36942ef7a74c673f2200",
    "id": null,
    "metadata": {},
    "name": "HomepageAllPostsQuery",
    "operationKind": "query",
    "text": "query HomepageAllPostsQuery {\n  allPosts {\n    edges {\n      node {\n        title\n        body\n        comments {\n          edges {\n            node {\n              body\n              id\n            }\n          }\n        }\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6ca28f746c4d00de00ed7dfe28d6af66";

export default node;
