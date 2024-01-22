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
  mutation VoteButtonsSetVoteMutation($input: SetVoteInput!) {
    setVote(input: $input) {
      voteScore
      userVoteScore
    }
  }
`;

const VoteButtonsRemoveVoteMutation = graphql`
  mutation VoteButtonsRemoveVoteMutation($input: RemoveVoteInput!, $connections: [ID!]!) {
    removeVote(input: $input) {
      voteScore
      userVoteScore
      deletedVoteId @deleteEdge(connections: $connections)
    }
  }
`;

//@argumentDefinitions(userId: { type: "String!", defaultValue: "" })
//hasVoted(userId: $userId)
const VoteButtonsFragment = graphql`
  fragment VoteButtonsFragment on Post {
    votes {
      __id
      voteScore
      userVoteScore
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
      {JSON.stringify(votes)}
      votes: {votes!.voteScore}{" "}
      <button
        className={clsx(votes!.userVoteScore === 1 && "VoteButtons--button--hasUpVoted")}
        onClick={() => {
          if (votes!.userVoteScore === 1) {
            //const connectionID = ConnectionHandler.getConnectionID(postId, "CommentsFragment_comments");
            //console.log("connectionID", connectionID);
            commitRemoveVoteMutation({
              variables: {
                input: {
                  postId,
                  commentId,
                },
                connections: [votes!.__id],
              },
              updater: (store, { removeVote }) => {
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
                );
                votesConnectionRecord?.setValue(removeVote?.voteScore, "voteScore");
                votesConnectionRecord?.setValue(removeVote?.userVoteScore, "userVoteScore");

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
            },
            updater: (store, { setVote }) => {
              console.log("updater", setVote);
              const parentEntityRecord = store.get(postId || commentId || "") as ReadOnlyRecordProxy;
              const votesConnectionRecord = parentEntityRecord!.getLinkedRecord("votes");
              //const votesConnectionRecord2 = ConnectionHandler.getConnection(parentEntityRecord, "votes");

              // Get the payload returned from the server
              const payload = store.getRootField("setVote");
              console.log(
                votesConnectionRecord,
                //votesConnectionRecord2,
                //votesConnectionRecord === votesConnectionRecord2,
                payload,
              );
              votesConnectionRecord?.setValue(setVote?.voteScore, "voteScore");
              votesConnectionRecord?.setValue(setVote?.userVoteScore, "userVoteScore");

              // Get the edge inside the payload
              //const serverEdge = payload!.getLinkedRecord("votes");
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
