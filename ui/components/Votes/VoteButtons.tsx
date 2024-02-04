import { useState, Suspense } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { graphql, useFragment, useMutation, readInlineData, ConnectionHandler } from "react-relay";
import { ReadOnlyRecordProxy } from "relay-runtime";
import { clsx } from "clsx";
import { VoteButtonsFragment$key } from "./__generated__/VoteButtonsFragment.graphql";
import { VoteButtonsSetVoteMutation as SetVoteMutationType } from "./__generated__/VoteButtonsSetVoteMutation.graphql";
import { VoteButtonsRemoveVoteMutation as RemoveVoteMutationType } from "./__generated__/VoteButtonsRemoveVoteMutation.graphql";

import "./VoteButtons.css";

const VoteButtonsSetVoteMutation = graphql`
  mutation VoteButtonsSetVoteMutation($input: SetVoteInput!, $connections: [ID!]!) {
    setVote(input: $input) {
      voteScore
      userVoteValue
      voteEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
        }
      }
    }
  }
`;
/*

  mutation VoteButtonsSetVoteMutation($input: SetVoteInput!) {

      voteEdge {
        cursor
        node {
          id
        }
      }


      voteEdge @appendEdge(connections: $connections) {
        cursor
        node {
          id
        }
      }
*/

const VoteButtonsRemoveVoteMutation = graphql`
  mutation VoteButtonsRemoveVoteMutation($input: RemoveVoteInput!, $connections: [ID!]!) {
    removeVote(input: $input) {
      voteScore
      userVoteValue
      deletedVoteId @deleteEdge(connections: $connections)
    }
  }
`;

/*
@argumentDefinitions(userId: { type: "String!", defaultValue: "" })
    votes(first: 0) @connection(key: "VoteButtonsFragment_votes") {
    votes {
  */
const VoteButtonsFragment = graphql`
  fragment VoteButtonsFragment on Voteable {
    votes(first: 100) @connection(key: "VoteButtonsFragment_votes") {
      __id
      voteScore
      userVoteValue
      edges {
        node {
          id
        }
      }
    }
  }
`;

type Props = {
  postId?: string;
  commentId?: string;
  voteButtonsContainer: VoteButtonsFragment$key;
};

export const VoteButtons: React.FC<Props> = ({ postId, commentId, voteButtonsContainer }) => {
  const { votes } = useFragment(VoteButtonsFragment, voteButtonsContainer);
  const [commitSetVoteMutation, isSetVoteMutationInFlight] = useMutation<SetVoteMutationType>(VoteButtonsSetVoteMutation);
  const [commitRemoveVoteMutation, isRemoveVoteMutationInFlight] =
    useMutation<RemoveVoteMutationType>(VoteButtonsRemoveVoteMutation);
  return (
    <div>
      <div>{JSON.stringify(votes)}</div>
      votes: {votes!.voteScore} {votes!.__id}
      <button
        className={clsx(votes!.userVoteValue === 1 && "VoteButtons--button--hasUpVoted")}
        onClick={() => {
          //const connectionID = ConnectionHandler.getConnectionID(postId || commentId || "", "VoteButtonsFragment_votes");
          //console.log("connectionID", connectionID);
          if (votes!.userVoteValue === 1) {
            commitRemoveVoteMutation({
              variables: {
                input: {
                  postId,
                  commentId,
                },
                connections: [votes!.__id],
                //connections: [connectionID],
              },
              updater: (store, response) => {
                let removeVote = response!.removeVote;
                console.log("updater removevote", removeVote);
                const parentEntityRecord = store.get(postId || commentId || "") as ReadOnlyRecordProxy;
                const votesConnectionRecord = parentEntityRecord!.getLinkedRecord("votes");
                const connectionRecord = store.get(votes!.__id);
                //const votesConnectionRecord2 = ConnectionHandler.getConnection(parentEntityRecord, "votes");

                // Get the payload returned from the server
                const payload = store.getRootField("removeVote");
                console.log(
                  connectionRecord,
                  votesConnectionRecord,
                  votesConnectionRecord === connectionRecord,
                  //votesConnectionRecord2,
                  //votesConnectionRecord === votesConnectionRecord2,
                  payload,
                  removeVote,
                );
                //votesConnectionRecord?.setValue(removeVote?.voteScore, "voteScore");
                //votesConnectionRecord?.setValue(removeVote?.userVoteValue, "userVoteValue");

                connectionRecord?.setValue(removeVote?.voteScore, "voteScore");
                connectionRecord?.setValue(removeVote?.userVoteValue, "userVoteValue");

                // Get the edge inside the payload
                //const serverEdge = payload!.getLinkedRecord("votes");
              },
              optimisticUpdater: () => {},
              onCompleted: ({ removeVote }) => {},
            });
            return;
          }

          commitSetVoteMutation({
            variables: {
              input: {
                postId,
                commentId,
                value: 1,
              },
              connections: [votes!.__id],
              //connections: [connectionID],
            },
            updater: (store, response) => {
              const setVote = response?.setVote;
              console.log("updater", response);
              const parentEntityRecord = store.get(postId || commentId || "") as ReadOnlyRecordProxy;
              const votesConnectionRecord = parentEntityRecord!.getLinkedRecord("votes");
              const connectionRecord = store.get(votes!.__id);
              //ConnectionHandler.getConnectionID()
              //const votesConnectionRecord2 = ConnectionHandler.getConnection(parentEntityRecord, "votes");
              //const votesConnectionRecord3 = ConnectionHandler.getConnection(parentEntityRecord, votes!.__id);
              //const connectionID = ConnectionHandler.getConnectionID(postId || commentId || "", votes!.__id);
              //const votesConnectionRecord4 = store.get(connectionID);

              // Get the payload returned from the server
              const payload = store.getRootField("setVote");
              console.log(
                votesConnectionRecord,
                //votesConnectionRecord2,
                votesConnectionRecord === connectionRecord,
                //votesConnectionRecord3,
                //connectionID,
                //votesConnectionRecord4,
                payload,
              );

              // Get the edge inside the payload
              const serverEdge = payload!.getLinkedRecord("voteEdge");
              //console.log(serverEdge.getType());
              const serverEdgeNode = serverEdge!.getLinkedRecord("node");
              const newEdge = ConnectionHandler.createEdge(store, connectionRecord!, serverEdgeNode, "VoteEdge");
              //let thing = votesConnectionRecord?.getValue("__connection_next_edge_index");
              //let thyoa = connectionRecord?.getValue("__connection_next_edge_index");

              // not sure why buildConnectionEdge doesn't work here
              //const newEdge = ConnectionHandler.buildConnectionEdge(store, connectionRecord!, serverEdge);

              // we can use this if we don't have a paginated @connection directive on the connection
              //ConnectionHandler.insertEdgeAfter(connectionRecord!, newEdge!);

              connectionRecord?.setValue(setVote?.voteScore, "voteScore");
              connectionRecord?.setValue(setVote?.userVoteValue, "userVoteValue");
            },
            optimisticUpdater: () => {},
            onCompleted: ({ setVote }) => {},
          });
        }}
      >
        ⬆
      </button>
    </div>
  );
};
